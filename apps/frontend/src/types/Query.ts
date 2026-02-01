export type QueryKey = string;

export type QueryValue = number | string | Date;

export type Query = Record<QueryKey, QueryValue | readonly QueryValue[]>;

export type QueryContext = {
  /**
   * Current unformatted query value.
   */
  readonly value: Query;

  /**
   * Previous unformatted query value.
   *
   * - This value is updated by `use` function,
   * and is set to the value of `value` variable on `use`.
   */
  readonly previousValue: Query | null;

  /**
   * Change the current query value.
   *
   * - This also updated the `previousValue` value
   * before update to `value` value.
   */
  use(form: HTMLFormElement, defaultValue?: Query): void;
  use(data: Query, defaultValue?: Query): void;
  use(data: undefined, defaultValue: Query): void;

  /**
   * Update the current query value.
   */
  update(form: HTMLFormElement): void;
  update(data: Query): void;

  /**
   * Remove one or more parameters from query value.
   */
  remove(...parameters: readonly QueryKey[]): void;

  /**
   * Reset the current query value to default value if any.
   */
  reset(): void;

  /**
   * Get keys that changed since last query update.
   */
  getDirty(): QueryKey[];

  /**
   * Format the query value to URL query parameters.
   */
  toString(): string;
};
