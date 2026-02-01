import { createEnumCase, createBackedEnum } from '@daniloivk/ts-backed-enum';
import { Comparable, Translatable } from '@studis/common';
import { RoleEnum } from '../schema/types';

const CaseClass = createEnumCase(Comparable, Translatable.from('role'));
const Role = createBackedEnum(RoleEnum, CaseClass);

export type CaseType = Readonly<InstanceType<typeof CaseClass>>;
export default Role;
