import { createEnumCase, createBackedEnum } from '@daniloivk/ts-backed-enum';
import { Translatable } from '@studis/common';

export enum DayOfWeekEnum {
	MONDAY = 1,
	TUESDAY = 2,
	WEDNESDAY = 3,
	THURSDAY = 4,
	FRIDAY = 5,
	SATURDAY = 6,
	SUNDAY = 0,
}

const CaseClass = createEnumCase(Translatable.from('day_of_week', 'enums'));
const DayOfWeek = createBackedEnum(DayOfWeekEnum, CaseClass);

export type DayOfMonthCaseType = InstanceType<typeof CaseClass>;
export { DayOfWeek };
