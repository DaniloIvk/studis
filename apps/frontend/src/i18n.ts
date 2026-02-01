// i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import { zodI18nResources } from '@studis/common';

i18n
	.use(Backend)
	.use(initReactI18next)
	.init({
		lng: 'sr',
		fallbackLng: 'sr',
		ns: ['common', 'enums'],
		defaultNS: 'common',
		react: { useSuspense: true },
		backend: { loadPath: 'locales/{{lng}}/{{ns}}.json' },
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
		debug: true,
	});
i18n.addResourceBundle(
	'sr',
	'validation',
	zodI18nResources.sr.validation,
	true,
	true,
);

export default i18n;
