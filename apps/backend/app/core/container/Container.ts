/**
 * Constructor type for classes that can be instantiated by the container.
 */
type Constructor<T = any> = new (...args: any[]) => T;

/**
 * Application Service Container for singleton management and recursive dependency resolution.
 */
class Container {
  private static instances = new Map<any, any>();
  private static bindings = new Map<any, Constructor>();

  /**
   * Registers a concrete implementation for a given abstract constructor.
   */
  public static bind<T>(
    abstract: Constructor<T>,
    concrete: Constructor<T>
  ): void {
    this.bindings.set(abstract, concrete);
  }

  /**
   * Removes a cached singleton instance.
   */
  public static forget(target: Constructor): void {
    this.instances.delete(target);
  }

  /**
   * Resolves a singleton instance. Subsequent calls return the same instance.
   */
  public static resolve<T>(target: Constructor<T>): T {
    const concrete = (this.bindings.get(target) || target) as Constructor<T>;

    if (this.instances.has(concrete)) {
      return this.instances.get(concrete);
    }

    const instance = this.build(concrete);
    this.instances.set(concrete, instance);

    return instance;
  }

  /**
   * Resolves a transient instance. Always returns a new instance of the target.
   */
  public static make<T>(target: Constructor<T>): T {
    const concrete = (this.bindings.get(target) || target) as Constructor<T>;

    return this.build(concrete);
  }

  /**
   * Internal worker to handle recursive dependency injection and instantiation.
   */
  private static build<T>(concrete: Constructor<T>): T {
    const dependencies = (concrete as any).dependencies || [];

    const resolvedDependencies = dependencies.map((dependency: Constructor) => {
      return this.resolve(dependency);
    });

    return new concrete(...resolvedDependencies);
  }
}

export default Container;
