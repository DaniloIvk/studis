type Case<T, R> = readonly [T, () => R];

/**
 * Match the first condition equal to the given value,
 * otherwise the return the fallback value.
 *
 * ---
 * - Do NOT use when:
 *   - branches contain complex logic
 *   - conditions are not trivial
 *   - control flow (loops, early exits) is required
 * ---
 * - Cases are evaluated top-to-bottom (first match wins)
 * ---
 * - When to use: When you have bunch of if else / switch statements
 * that are just a simple assignment based on some simple condition(s).
 * ---
 * Example usage:
 * ```typescript
 * // Code like
 * switch (request.method) {
 *   case 'GET':
 *     ...
 *     break;
 *   case 'POST':
 *     ...
 *     break;
 *   case 'PATCH':
 *     ...
 *     break;
 *   ...
 *
 *   default:
 *     ...
 *     break;
 * }
 *
 * // Becomes
 * match(request.method, [
 *   ['GET', () => ...],
 *   ['POST', () => ...],
 *   ['PATCH', () => ...],
 *   ...
 * ], () => ...)
 * ```
 */
export function match<T, R>(
	value: T,
	cases: readonly Case<T, R>[],
	fallback: () => R,
): R;

/**
 * Match the first condition equal to the given value.
 *
 * ---
 * - Do NOT use when:
 *   - branches contain complex logic
 *   - conditions are not trivial
 *   - control flow (loops, early exits) is required
 * ---
 * - Cases are evaluated top-to-bottom (first match wins)
 * ---
 * - When to use: When you have bunch of if else / switch statements
 * that are just a simple assignment based on some simple condition(s).
 * ---
 * Example usage:
 * ```typescript
 * // Code like
 * switch (request.method) {
 *   case 'GET':
 *     ...
 *     break;
 *   case 'POST':
 *     ...
 *     break;
 *   case 'PATCH':
 *     ...
 *     break;
 *   ...
 * }
 *
 * // Becomes
 * match(request.method, [
 *   ['GET', () => ...],
 *   ['POST', () => ...],
 *   ['PATCH', () => ...],
 *   ...
 * ])
 * ```
 */
export function match<T, R>(
	value: T,
	cases: readonly Case<T, R>[],
): R | undefined;

export function match<T, R>(
	value: T,
	cases: readonly Case<T, R>[],
	fallback?: () => R,
): R | undefined {
	for (const [condition, callback] of cases) {
		if (condition === value) {
			return callback();
		}
	}

	return fallback ? fallback() : undefined;
}

/**
 * Match the first case with condition value `true`,
 * otherwise return the fallback value.
 *
 * ---
 * - Cases are evaluated top-to-bottom (first match wins)
 * ---
 * - Do NOT use when:
 *   - branches contain complex logic
 *   - conditions are not trivial
 *   - control flow (loops, early exits) is required
 * ---
 * - When to use: When you have bunch of if else / switch statements
 * that are just a simple assignment based on some simple condition(s).
 * ---
 * Example usage:
 * ```typescript
 * // Code like
 * if (request.statusCode >= 500) {
 *   ...
 * } else if (request.statusCode >= 400) {
 *   ...
 * } else if (request.statusCode >= 300) {
 *   ...
 * }
 * ...
 * } else {
 *   ...
 * }
 *
 *
 * // Becomes
 * matchWhen([
 *   [request.statusCode >= 500, () => ...],
 *   [request.statusCode >= 400, () => ...],
 *   [request.statusCode >= 300, () => ...],
 *   ...
 * ], () => ...)
 * ```
 */
export function matchWhen<R>(
	cases: readonly Case<boolean, R>[],
	fallback: () => R,
): R;

/**
 * Match the first case with condition value `true`.
 *
 * ---
 * - Do NOT use when:
 *   - branches contain complex logic
 *   - conditions are not trivial
 *   - control flow (loops, early exits) is required
 * ---
 * - Cases are evaluated top-to-bottom (first match wins)
 * ---
 * - When to use: When you have bunch of if else / switch statements
 * that are just a simple assignment based on some simple condition(s).
 * ---
 * Example usage:
 * ```typescript
 * // Code like
 * if (request.statusCode >= 500) {
 *   ...
 * } else if (request.statusCode >= 400) {
 *   ...
 * } else if (request.statusCode >= 300) {
 *   ...
 * }
 * ...
 *
 * // Becomes
 * matchWhen([
 *   [request.statusCode >= 500, () => ...],
 *   [request.statusCode >= 400, () => ...],
 *   [request.statusCode >= 300, () => ...],
 *   ...
 * ])
 * ```
 */
export function matchWhen<R>(cases: readonly Case<boolean, R>[]): R | undefined;

export function matchWhen<R>(
	cases: readonly Case<boolean, R>[],
	fallback?: () => R,
): R | undefined {
	for (const [condition, fn] of cases) {
		if (condition) return fn();
	}

	return fallback ? fallback() : undefined;
}
