import { EnumCase } from '@daniloivk/ts-backed-enum';

class Comparable extends EnumCase {
  public is(other: EnumCase<any, any>): boolean {
    return this.value === other.value;
  }

  public isNot(other: EnumCase<any, any>): boolean {
    return this.value !== other.value;
  }

  public isAny(others: readonly EnumCase<any, any>[]): boolean {
    return others.some((other) => this.is(other));
  }

  public isNone(others: readonly EnumCase<any, any>[]): boolean {
    return !this.isAny(others);
  }
}

export default Comparable;
