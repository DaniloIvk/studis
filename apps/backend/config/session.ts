import session from 'express-session';
import appConfig from './app';

const sessionConfig: session.SessionOptions = {
	secret: appConfig.appKey,
	saveUninitialized: true,
	resave: false,
	cookie: {
		maxAge: Number(process.env.SESSION_LIFETIME) || 24 * 60 * 60 * 1000,
	},
};

export default sessionConfig;
