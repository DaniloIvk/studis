import { useEffect, type PropsWithChildren } from 'react';
import { zodI18nErrorMap } from '@studis/common';
import { useTranslation } from 'react-i18next';
import z from 'zod';

function ZodProvider({ children }: PropsWithChildren) {
	const { t, i18n } = useTranslation();
	const zodErrorMap = zodI18nErrorMap(t);

	useEffect(() => {
		z.config({
			customError: zodErrorMap,
			localeError: zodErrorMap,
			jitless: true,
		});
	}, [t, i18n.language]);

	return <>{children}</>;
}

export default ZodProvider;
