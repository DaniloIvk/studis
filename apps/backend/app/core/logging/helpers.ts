import chalk from 'chalk';
import appConfig from '../../../config/app';
import Environment from '../../enums/Environment';

/**
 * Log data only if in local or development environment, using a specified level.
 */
export function safelyLog(level: keyof Console, ...data: any[]) {
	if (
		appConfig.environment.isNone([Environment.LOCAL, Environment.DEVELOPMENT])
	) {
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
	safelyLog('debug', chalk.white(data));
}

/**
 * Log data only if in local or development environment, using `info` level.
 *
 * @see safelyLog
 */
export function logInfo(...data: any[]): void {
	safelyLog('info', chalk.green(data));
}

/**
 * Log data only if in local or development environment, using `warn` level.
 *
 * @see safelyLog
 */
export function logWarn(...data: any[]): void {
	safelyLog('warn', chalk.yellow(data));
}

/**
 * Log error only if in local or development environment, using `error` level.
 *
 * @see safelyLog
 */
export function logErrors(...errors: any[]): void {
	safelyLog('error', chalk.red(errors));
}
/**
 * Safely await data, catching any error without needing to specify catch callback.
 *
 * @see logData
 * @see logErrors
 */
export async function awaitSafely<T>(
	promise: Promise<T>,
	next: (data: T) => any = logData,
	error: (error: Error) => any = logErrors,
	complete: () => any = () => {},
): Promise<void> {
	await promise.then(next).catch(error).finally(complete);
}
