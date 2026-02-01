import { createBackedEnum, createEnumCase } from '@daniloivk/ts-backed-enum';
import Comparable from '../traits/enum/Comparable';

export enum EnvironmentEnum {
  LOCAL = 'local',
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
}

const CaseClass = createEnumCase(Comparable);
const Environment = createBackedEnum(EnvironmentEnum, CaseClass);

export type CaseType = InstanceType<typeof CaseClass>;
export default Environment;
