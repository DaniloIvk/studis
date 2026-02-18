import { NextFunction, Request, Response } from 'express';
import appConfig from '../../../config/app';

function corsPolicy(
  request: Request,
  response: Response,
  next: NextFunction
): Response | void {
  const allowedOrigins = [appConfig.appUrl, ...appConfig.appFrontendUrls];
  const origin = request.headers.origin;

  if (origin && allowedOrigins.includes(origin)) {
    response.setHeader('Access-Control-Allow-Origin', origin);
  }

  response.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE, OPTIONS'
  );

  response.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With, Content-Type, Authorization, Accept'
  );

  response.setHeader('Access-Control-Allow-Credentials', 'true');

  if (request.method === 'OPTIONS') {
    response.statusCode = 204; // No content
    return response.end();
  }

  next();
}

export default corsPolicy;
