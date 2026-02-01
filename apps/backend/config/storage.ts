import { ServeStaticOptions } from 'serve-static';

const storageConfig: ServeStaticOptions = {
	immutable: true,
	maxAge: '30d',
	index: false,
};

export default storageConfig;
