import type { FormFieldBaseContract, FormFieldUtils } from '../Form';

export type DatePickerContract = FormFieldBaseContract & {
	readonly dateFormat?: string;
	readonly firstDayOfWeek?: DayOfWeek;
	readonly className?: string;
	readonly allowClear?: boolean;
	readonly disabled?: boolean;
	readonly readOnly?: boolean;
};

export type DatePickerProps = DatePickerContract & FormFieldUtils;

export type DayOfWeek =
	| 'monday'
	| 'tuesday'
	| 'wednesday'
	| 'thursday'
	| 'friday'
	| 'saturday'
	| 'sunday';

export type DayOfWeekValue = 1 | 2 | 3 | 4 | 5 | 6 | 0;

export type DayOfWeekProps<DayOfWeekValue extends number = number> = {
	readonly label: string;
	readonly value: DayOfWeekValue;
};

export type DaysOfWeek = Record<DayOfWeek, DayOfWeekProps<DayOfWeekValue>>;

export type MonthOfYear =
	| 'january'
	| 'february'
	| 'march'
	| 'april'
	| 'may'
	| 'june'
	| 'july'
	| 'august'
	| 'september'
	| 'october'
	| 'november'
	| 'december';

export type MonthOfYearValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

export type MonthsOfYear = Record<MonthOfYearValue, MonthOfYear>;
