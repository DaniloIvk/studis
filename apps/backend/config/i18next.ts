import path from 'node:path';
import { InitOptions } from 'i18next';

const i18nextConfig: InitOptions = {
	fallbackLng: 'sr',
	preload: ['sr'],
	ns: ['common', 'validation'],
	defaultNS: 'common',
	backend: { loadPath: path.resolve('lang/{{lng}}/{{ns}}.json') },
	interpolation: {
		escapeValue: false,
		format: (value, format, _) => {
			if (format === 'capitalize') {
				return value.charAt(0).toUpperCase() + value.slice(1);
			}

			if (format === 'uppercase') {
				return value.toUpperCase();
			}

			return value;
		},
	},
};

export default i18nextConfig;
