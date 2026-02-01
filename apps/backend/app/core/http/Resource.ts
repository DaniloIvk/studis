abstract class Resource<R extends object = object> {
	private static _instances = new Map<Function, Resource>();

	protected keepUndefined: boolean = false;
	protected resource!: R;

	public abstract serialize(): any;

	private static resolveInstance<T extends Resource>(
		constructor: new () => T,
	): T {
		if (!this._instances.has(constructor)) {
			this._instances.set(constructor, new constructor());
		}

		return this._instances.get(constructor) as T;
	}

	public static make<T extends Resource>(
		this: new () => T,
		resource: any,
	): object | undefined {
		if (!resource) {
			return undefined;
		}

		const instance = Resource.resolveInstance(this);

		instance.resource = resource;

		const mapped = instance.serialize();

		return mapped;
	}

	public static collect<T extends Resource>(
		this: new () => T,
		resources: any[],
	): any[] {
		const instance = Resource.resolveInstance(this);

		const mapped = resources.map((resource: object) => {
			instance.resource = resource;

			return instance.serialize();
		});

		if (instance.keepUndefined === false) {
			return mapped.filter((resource) => resource !== undefined);
		}

		return mapped;
	}
}

export default Resource;
