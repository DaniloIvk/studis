import type { FormFieldBaseContract, FormFieldUtils } from '../Form';

export type MaskedFieldContract = FormFieldBaseContract & {
	readonly type: 'masked';
	readonly minLength?: number;
	readonly maxLength?: number;
};

export type MaskedFieldProps = MaskedFieldContract & FormFieldUtils;
