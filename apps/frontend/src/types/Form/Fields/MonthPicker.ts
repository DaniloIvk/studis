import type { FormFieldBaseContract, FormFieldUtils } from '../../Common';

export type MonthPickerContract = FormFieldBaseContract & {
	readonly type: 'monthPicker';
	readonly allowClear?: boolean;
};

export type MonthPickerProps = MonthPickerContract & FormFieldUtils;
