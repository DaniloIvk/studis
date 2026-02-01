import { createEnumCase, createBackedEnum } from '@daniloivk/ts-backed-enum';
import { Stringable, Comparable } from '@studis/common';

enum ThemeEnum {
	LIGHT = 1,
	DARK = 2,
	SYSTEM = 3,
}

const CaseClass = createEnumCase(Comparable, Stringable);
const Theme = createBackedEnum(ThemeEnum, CaseClass);

export type CaseType = InstanceType<typeof CaseClass>;
export default Theme;
