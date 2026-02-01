import { EnumCase } from '@daniloivk/ts-backed-enum';

class Comparable extends EnumCase {
  public is(other: this) {
    return this.value === other.value;
  }

  public isNot(other: this) {
    return !this.is(other);
  }

  public isAny(other: this[]) {
    return other.some((item) => this.is(item));
  }

  public isNone(other: this[]) {
    return !this.isAny(other);
  }

  public matches(value: unknown) {
    const valueType = typeof value;

    if (
      value instanceof Comparable ||
      valueType === 'string' ||
      valueType === 'number'
    ) {
      return this.value === value;
    }

    return false;
  }
}

export default Comparable;
