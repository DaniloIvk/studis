import type { FormFieldBaseContract, FormFieldUtils } from '../Form';

export type TextFieldContract = FormFieldBaseContract &
	(TextFieldBaseContract | NumberFieldBaseContract);

export type TextFieldProps = TextFieldContract & FormFieldUtils;

type NumberFieldBaseContract = {
	readonly type: 'number';
	readonly min?: number;
	readonly max?: number;
	readonly minLength?: never;
	readonly maxLength?: never;
};

type TextFieldBaseContract = {
	readonly type: 'text' | 'email';
	readonly min?: never;
	readonly max?: never;
	readonly minLength?: number;
	readonly maxLength?: number;
};
