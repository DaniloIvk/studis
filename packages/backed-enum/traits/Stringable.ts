import { EnumCase } from '@daniloivk/ts-backed-enum';

export class Stringable extends EnumCase {
	protected stringableValue: string = '';

	public stringable(): this {
		this.stringableValue = this.name.toLowerCase();

		return this;
	}

	public toString() {
		return this.stringableValue;
	}
}
