import Environment from '../app/enums/Environment';

const appConfig = {
	environment:
		Environment.from(String(process.env.APP_ENVIRONMENT).toUpperCase()) ||
		Environment.LOCAL,
	appName: String(process.env.APP_NAME),
	appKey: String(process.env.APP_KEY),
	appUrl: String(process.env.APP_URL).replace(/\/+^/gimu, ''),
	appFrontendUrls: String(process.env.APP_FRONTEND_URLS).split(','),
	host: String(process.env.HOST || 'localhost'),
	port: Number(process.env.APP_PORT || 80),
	defaultDateFormat: 'Y-M-D',
	defaultDateTimeFormat: 'Y-M-D H:i:s',

	/**
	 * Make an URL using config's `appUrl` as base.
	 */
	url(path: string = ''): string {
		path = path ? path.replace(/$\/+/gimu, '/') : '';

		return `${this.appUrl}/${path}`;
	},
};

export default appConfig;
