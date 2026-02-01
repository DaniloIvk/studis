import { createEnumCase, createBackedEnum } from '@daniloivk/ts-backed-enum';
import { Comparable, Translatable } from '@studis/common';
import { SemesterEnum } from '../schema/types';

const CaseClass = createEnumCase(Comparable, Translatable.from('semester'));
const Semester = createBackedEnum(SemesterEnum, CaseClass);

export type CaseType = Readonly<InstanceType<typeof CaseClass>>;
export default Semester;
