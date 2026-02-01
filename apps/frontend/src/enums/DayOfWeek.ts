import { createEnumCase, createBackedEnum } from '@daniloivk/ts-backed-enum';
import { Translatable } from '@studis/common';

enum ThemeEnum {
	MONDAY = 1,
	TUESDAY = 2,
	WEDNESDAY = 3,
	THURSDAY = 4,
	FRIDAY = 5,
	SATURDAY = 6,
	SUNDAY = 0,
}

const CaseClass = createEnumCase(Translatable.from('day_of_week'));
const Theme = createBackedEnum(ThemeEnum, CaseClass);

export type CaseType = InstanceType<typeof CaseClass>;
export default Theme;
