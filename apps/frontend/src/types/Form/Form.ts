import type {
	FunctionComponent,
	HTMLInputAutoCompleteAttribute,
	HTMLProps,
} from 'react';
import { ZodType } from 'zod';
import {
	type Control,
	type FieldErrors,
	type SubmitHandler,
	type UseFormRegister,
	type UseFormSetValue,
	type UseFormWatch,
} from 'react-hook-form';
import type {
	DatePickerContract,
	DatePickerProps,
	DropdownContract,
	DropdownProps,
	EnumDropdownContract,
	EnumDropdownProps,
	ErrorResponse,
	FileUploadContract,
	FileUploadProps,
	MaskedFieldContract,
	MaskedFieldProps,
	TextFieldContract,
	TextFieldProps,
} from '../Common';
import type Service from '../../core/service/Service';
import type {
	MonthPickerContract,
	MonthPickerProps,
} from './Fields/MonthPicker';
import type { YearPickerContract, YearPickerProps } from './Fields/YearPicker';

export * from './Fields/TextField';
export * from './Fields/MaskedField';
export * from './Fields/Dropdown';
export * from './Fields/EnumDropdown';
export * from './Fields/FileUpload';
export * from './Fields/DatePicker';
export * from './Fields/MonthPicker';
export * from './Fields/YearPicker';
export * from './Label';

/**
 * Common properties for all fields.
 */
export type FormFieldBaseContract<T extends HTMLElement = HTMLInputElement> = {
	readonly [key: string]: unknown;
	readonly type: FieldType;
	readonly name: string;
	readonly label?: string;
	readonly placeholder?: string;
	readonly autoCapitalize?: 'on' | 'off';
	readonly autoComplete?: HTMLInputAutoCompleteAttribute;
	readonly className?: string;
	readonly disabled?: boolean;
	readonly readOnly?: boolean;
	readonly inputProps?: HTMLProps<T>;
};

export type FieldType =
	| 'text'
	| 'number'
	| 'email'
	| 'masked'
	| 'dropdown'
	| 'enumDropdown'
	| 'fileUpload'
	| 'datePicker'
	| 'monthPicker'
	| 'yearPicker';

export type FormFieldContract<ApiService extends Service = any> =
	| TextFieldContract
	| MaskedFieldContract
	| DropdownContract<ApiService>
	| EnumDropdownContract
	| FileUploadContract
	| DatePickerContract
	| MonthPickerContract
	| YearPickerContract;

/*
 * Field props and components combined types.
 */
export type FieldPropsByType = {
	readonly text: TextFieldProps;
	readonly number: TextFieldProps;
	readonly email: TextFieldProps;
	readonly masked: MaskedFieldProps;
	readonly dropdown: DropdownProps;
	readonly enumDropdown: EnumDropdownProps;
	readonly fileUpload: FileUploadProps;
	readonly datePicker: DatePickerProps;
	readonly monthPicker: MonthPickerProps;
	readonly yearPicker: YearPickerProps;
};

export type FieldComponentMap = {
	readonly [K in keyof FieldPropsByType]: FunctionComponent<
		FieldPropsByType[K]
	>;
};

/**
 * Common data passed to each field by the form component.
 */
export type FormFieldUtils = {
	readonly errors: FieldErrors<any>;
	readonly register: UseFormRegister<any>;
	readonly setValue: UseFormSetValue<any>;
	readonly control: Control<any, any, any>;
	readonly watch: UseFormWatch<any>;
};

export type FormFieldProps =
	| TextFieldProps
	| MaskedFieldProps
	| DropdownProps
	| EnumDropdownProps
	| FileUploadProps
	| DatePickerProps
	| MonthPickerProps
	| YearPickerProps;

/*
 * Form field component.
 */
export type FormFieldComponent =
	| FunctionComponent<TextFieldProps>
	| FunctionComponent<MaskedFieldProps>
	| FunctionComponent<DropdownProps>
	| FunctionComponent<EnumDropdownProps>
	| FunctionComponent<FileUploadProps>
	| FunctionComponent<DatePickerProps>
	| FunctionComponent<MonthPickerProps>
	| FunctionComponent<YearPickerProps>;

/*
 * Form types
 */
export type FormContract<ApiService extends Service = any> = {
	readonly schema?: ZodType<any, any>;
	readonly fields: readonly FormFieldContract<ApiService>[];
	readonly showSubmit?: boolean;
	readonly showReset?: boolean;
	readonly resubmitOnReset?: boolean;
	readonly defaultValues?: Record<string, string | number>;
	readonly featuredImage?: {
		readonly src: string;
		readonly className?: string;
	};
};

export type FormProps = FormContract & {
	readonly onSubmit: SubmitHandler<any>;
	readonly onReset?: Function;
	readonly submitButtonText?: string;
	readonly className?: string;
};

export type ModalFormProps = FormProps & {
	readonly title?: string;
	readonly size?: 'small' | 'medium' | 'big';
	readonly setHidden?: (hidden: boolean) => any;
	readonly hidden?: boolean;
	readonly hideCloseButton?: boolean;
};

export type ForwardedFormProps = {
	readonly setServerErrors: (error: ErrorResponse) => any;
};
