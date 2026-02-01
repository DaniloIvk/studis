import { createEnumCase, createBackedEnum } from '@daniloivk/ts-backed-enum';
import { Stringable } from '@studis/common';
import { Comparable } from '@studis/common';

enum EnvironmentEnum {
	LOCAL = 1,
	DEVELOPMENT = 2,
	PRODUCTION = 3,
}

const CaseClass = createEnumCase(Comparable, Stringable);
const Environment = createBackedEnum(EnvironmentEnum, CaseClass);

export type CaseType = InstanceType<typeof CaseClass>;
export default Environment;
