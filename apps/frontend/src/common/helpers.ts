import app from '../config/app';
import Environment from '../enums/Environment';
import type { Query } from '../types/Common';

/**
 * Log data only if in local or development environment, using a specified level.
 */
export function safelyLog(level: keyof Console = 'info', ...data: any[]): void {
	if (app.environment.isNone([Environment.LOCAL, Environment.DEVELOPMENT])) {
		return;
	}

	(console[level] as Function)(...data);
}

/**
 * Log data only if in local or development environment, using `debug` level.
 *
 * @see safelyLog
 */
export function logData(...data: any[]): void {
	safelyLog('debug', ...data);
}

/**
 * Log error only if in local or development environment, using `error` level.
 *
 * @see safelyLog
 */
export function logErrors(...errors: any[]): void {
	safelyLog('error', ...errors);
}

/**
 * Safely await data, catching any error without needing to specify catch callback.
 *
 * @param {any[]} args Arguments passed down to promise if it is a function.
 * @see logData
 * @see logErrors
 */
export async function awaitSafely<T, P, N, E, C>(
	promise:
		| Promise<T>
		| ((...args: readonly any[]) => Promise<any>)
		| readonly [P, keyof P],
	next: ((data: T) => any) | readonly [N, keyof N] = logData,
	error: ((error: Error) => any) | readonly [E, keyof E] = logErrors,
	complete: (() => any) | readonly [C, keyof C] = () => {},
	...args: readonly any[]
): Promise<void> {
	function getHandler(
		call: typeof promise | typeof next | typeof error | typeof complete,
	) {
		return Array.isArray(call) ?
				(call[0][call[1]] as Function).bind(call[0])
			:	(call as Function);
	}

	promise = getHandler(promise);

	const nextHandler = getHandler(next);
	const errorHandler = getHandler(error);
	const completeHandler = getHandler(complete);

	if (promise instanceof Promise) {
		await promise
			.then(nextHandler)
			.catch(errorHandler)
			.finally(completeHandler);
	} else if (promise instanceof Function) {
		await promise(...args)
			.then(nextHandler)
			.catch(errorHandler)
			.finally(completeHandler);
	}
}

export function formatQuery(query?: Query | null): string {
	if (!query || Object.values(query).length === 0) {
		return '';
	}

	const value = Object.entries(query)
		.map(([key, value]: [string, Query[keyof Query]]) => {
			if (Array.isArray(value))
				return value.map((value) => `${key}[]=${value}`).join('&');

			return `${key}=${value}`;
		})
		.join('&');

	return value.length > 1 ? `?${value}` : '';
}

/**
 * Get data from object or array, by specifying the desired value's path.
 */
export function dataGet(
	value: object | any[],
	path: string | string[],
	defaultValue: any = undefined,
) {
	const keys = typeof path === 'string' ? path.split('.') : path;
	let current = value;

	for (const key of keys) {
		if (current == null || !(key in current)) {
			return defaultValue;
		}

		current = current[key as keyof typeof current];
	}

	return current;
}

/**
 * Concatenate given input into a single string,
 * using space character as separator.
 */
export function concat(...args: any[]): string {
	return args.join(' ');
}
