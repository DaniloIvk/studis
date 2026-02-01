import { createBackedEnum, createEnumCase } from '@daniloivk/ts-backed-enum';
import Comparable from '../traits/enum/Comparable';
import { Role as RoleEnum } from '../../database/prisma/enums';

const CaseClass = createEnumCase(Comparable);
const Role = createBackedEnum(RoleEnum, CaseClass);

export type CaseType = InstanceType<typeof CaseClass>;
export default Role;
