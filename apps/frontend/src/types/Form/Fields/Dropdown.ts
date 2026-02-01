import type Service from '../../../core/service/Service';
import type { Constructor } from '../../Common';
import type { FormFieldBaseContract, FormFieldUtils } from '../Form';

export type DropdownContract<ApiService extends Service> =
	FormFieldBaseContract &
		DropdownBaseContract &
		(DropdownOptions | DropdownApiOptions<ApiService>);

export type DropdownProps = FormFieldBaseContract &
	DropdownBaseContract &
	Pick<DropdownOptions, 'options'> &
	Pick<DropdownApiOptions<any>, 'apiResponseDataOptions'> &
	FormFieldUtils;

type DropdownBaseContract = {
	readonly type: 'dropdown';
	readonly valueKey?: string;
	readonly labelKey?: string;
	readonly multiselect?: boolean;
	readonly allowClear?: boolean;
};

type DropdownOptions = {
	readonly options: readonly DropdownOption[];
	readonly apiResponseDataOptions?: never;
};

type DropdownApiOptions<ApiService extends Service> = {
	readonly options?: never;
	readonly apiResponseDataOptions: {
		readonly ApiService: Constructor<ApiService>;
		readonly apiRoute: MethodKeys<ApiService>;
	};
};

export type DropdownOption = { readonly [key: string]: number | string };

type MethodKeys<T> = {
	[K in keyof T]: T[K] extends (...args: any[]) => any ? K : never;
}[keyof T];
