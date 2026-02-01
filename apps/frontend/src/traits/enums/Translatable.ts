import { t } from 'i18next';
import Stringable from './Stringable';

abstract class Translatable extends Stringable {
	protected abstract readonly scope: string;
	protected abstract readonly namespace: string;
	public abstract readonly translationKey: string;
	public abstract readonly translation: string;

	/**
	 * Factory: Returns a customized Class Definition with the scope baked in.
	 * - Usage: ```Translatable.of('enums.[enum name]')```
	 *
	 * @param {string} [scope='enums'] i18next path
	 * @param {string} [namespace='common'] i18next namespace
	 */
	public static from(scope: string = 'enums', namespace: string = 'enums') {
		return class extends Translatable {
			protected override get scope(): string {
				return scope;
			}

			protected override get namespace(): string {
				return namespace;
			}

			public get translationKey(): string {
				return t(`${this.scope}.${this.name}`, { ns: this.namespace });
			}

			public get translation(): string {
				return t(this.translationKey);
			}
		};
	}
}

export default Translatable;
