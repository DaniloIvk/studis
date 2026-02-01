import type { FormFieldBaseContract, FormFieldUtils } from '../../Common';

export type YearPickerContract = FormFieldBaseContract & {
	readonly type: 'yearPicker';
	readonly allowClear?: boolean;
};

export type YearPickerProps = YearPickerContract & FormFieldUtils;
