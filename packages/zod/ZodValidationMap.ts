import { core } from 'zod';
import { type TFunction } from 'i18next';

function zodI18nErrorMap(t: TFunction): core.$ZodErrorMap<any> {
	return (issue: core.$ZodRawIssue<any>) => {
		// 1. Resolve Raw Data - Using the full path as you defined
		const rawFieldPath = (issue.path ?? [])
			.join('.')
			.replace(/\.\d+\./g, '.*.');

		// 2. Resolve Table/Model
		const rawTable = issue.params?.table;

		// 3. Translate Attribute and Model using i18next
		const attribute = t(`validation:attributes.${rawFieldPath}`, {
			defaultValue: rawFieldPath,
		});

		const model =
			rawTable ?
				t(`validation:models.${rawTable}`, { defaultValue: rawTable })
			:	rawTable;

		/**
		 * Translate Wrapper
		 * We pass the attribute and model directly into t()'s options.
		 * i18next handles the {{attribute}} and {{attribute, capitalize}} natively.
		 */
		const translate = (
			key: string,
			ruleParams: Record<string, any> = {},
		): string => {
			const min = ruleParams.min || issue.minimum;
			const max = ruleParams.max || issue.maximum;

			// Merge everything for i18next to handle interpolation
			const allParams = {
				...issue,
				...ruleParams,
				attribute,
				model,
				// Ensure min/max are at the top level for t() to see them
				min: typeof min === 'string' ? t(`validation:attributes.${min}`) : min,
				max: typeof max === 'string' ? t(`validation:attributes.${max}`) : max,
			};

			const translationKey = [
				`validation:overrides.${rawFieldPath}.${key}`,
				`validation:${key}`,
			];

			return t(translationKey, { defaultValue: issue.message, ...allParams });
		};

		// 5. Mapping Logic
		switch (issue.code) {
			case 'invalid_type':
				return {
					message: translate(
						issue.input === undefined ? 'required' : 'invalid_type',
						{ expected: issue.expected, received: issue.received },
					),
				};

			case 'too_small':
				const minType =
					issue.origin === 'string' ? 'min.string' : 'min.numeric';
				return { message: translate(minType) };

			case 'too_big':
				const maxType =
					issue.origin === 'string' ? 'max.string' : 'max.numeric';
				return { message: translate(maxType) };

			case 'invalid_string':
			case 'invalid_format':
				return { message: translate(issue.validation || 'invalid_format') };

			case 'custom':
				return {
					message: translate(issue.params?.i18n || 'invalid', issue.params),
				};

			default:
				return { message: translate(issue.code || 'invalid') };
		}
	};
}

export { zodI18nErrorMap };
