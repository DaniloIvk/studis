import { createEnumCase, createBackedEnum } from '@daniloivk/ts-backed-enum';
import { Translatable } from '@studis/common';

export enum MonthEnum {
	JANUARY = 0,
	FEBRUARY = 1,
	MARCH = 2,
	APRIL = 3,
	MAY = 4,
	JUNE = 5,
	JULY = 6,
	AUGUST = 7,
	SEPTEMBER = 8,
	OCTOBER = 9,
	NOVEMBER = 10,
	DECEMBER = 11,
}

const CaseClass = createEnumCase(Translatable.from('month', 'enums'));
const Month = createBackedEnum(MonthEnum, CaseClass);

export type MonthCaseType = InstanceType<typeof CaseClass>;
export { Month };
