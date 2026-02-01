import type { CaseType } from '../enums/Role';

class HasRole {
  public readonly role!: readonly CaseType[] | CaseType;
}

export default HasRole;
