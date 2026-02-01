import type {
	EnumLike,
	EnumCase,
	EnumContract,
	EnumHelpers,
} from '@daniloivk/ts-backed-enum';
import type Translatable from '../../../traits/enums/Translatable';
import type { FormFieldBaseContract, FormFieldUtils } from '../Form';

export type EnumDropdownContract<
	TEnum extends EnumLike = any,
	TCase extends EnumCase<any, any> & Translatable = EnumCase<any, any> &
		Translatable,
> = FormFieldBaseContract & {
	readonly type: 'enumDropdown';
	readonly Enum: EnumContract<TEnum, TCase> & EnumHelpers<TEnum, TCase>;
	readonly cases?: readonly TCase[];
	readonly multiselect?: boolean;
	readonly allowClear?: boolean;
};

export type EnumDropdownProps<
	Enum extends Record<string, number | string> = {},
> = EnumDropdownContract<Enum> & FormFieldUtils;
