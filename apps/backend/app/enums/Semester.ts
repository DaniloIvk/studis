import { createBackedEnum, createEnumCase } from '@daniloivk/ts-backed-enum';
import Comparable from '../traits/enum/Comparable';
import { Semester as SemesterEnum } from '../../database/prisma/enums';

const CaseClass = createEnumCase(Comparable);
const Semester = createBackedEnum(SemesterEnum, CaseClass);

export type CaseType = InstanceType<typeof CaseClass>;
export default Semester;
