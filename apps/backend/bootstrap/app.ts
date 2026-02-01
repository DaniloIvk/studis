import express from 'express';
import sessions from 'express-session';
import cookieParser from 'cookie-parser';
import favicon from 'serve-favicon';
import path from 'path';
import sessionConfig from '../config/session';
import apiRouter from '../routes/api';
import webRouter from '../routes/web';
import requestLogger from '../app/http/middleware/requestLogger';
import handleExceptions from '../app/http/middleware/handleExceptions';
import i18n, { t } from 'i18next';
import * as middleware from 'i18next-http-middleware';
import Backend from 'i18next-fs-backend';
import z from 'zod';
import { zodI18nErrorMap, zodI18nResources } from '@studis/common';
import corsPolicy from '../app/http/middleware/corsPolicy';
import storageConfig from '../config/storage';
import i18nextConfig from 'config/i18next';

const app: express.Express = express();

/**
 * Global middleware
 */
app.use(requestLogger);

/**
 * Cross-Origin Resource Sharing (CORS)
 */
app.use(corsPolicy);

/**
 * Translations
 */
i18n.use(Backend).use(middleware.LanguageDetector).init(i18nextConfig);
i18n.addResourceBundle(
	'sr',
	'validation',
	zodI18nResources.sr.validation,
	true,
	true,
);

// The middleware attaches 't' to the request object
app.use(middleware.handle(i18n));

const zodErrorMap = zodI18nErrorMap(t);
z.config({ customError: zodErrorMap, localeError: zodErrorMap, jitless: true });

/**
 * Request parsers
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Session
 */
app.use(sessions(sessionConfig));

app.use(cookieParser());

/**
 * Globalize request and response
 *
 * - Moved to router middleware, as the last middleware.
 */
// app.use(requestContext);
// app.use(responseContext);

/**
 * Routes
 */
app.use('/api', apiRouter);
app.use('/', webRouter);

/**
 * Favicon
 */
app.use(favicon(path.resolve('public/favicon.ico')));

/**
 * Expose the storage folder
 * This allows URLs like: http://localhost:8000/storage/app/materials/filename.pdf
 */
app.use(
	'/storage/app',
	express.static(path.resolve('storage/app'), storageConfig),
);

/**
 * Gracefully handle exceptions/errors
 */
app.use(handleExceptions);

export default app;
