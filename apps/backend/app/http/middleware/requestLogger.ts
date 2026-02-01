import { NextFunction, Request, Response } from 'express';
import { logData } from '../../core/logging/helpers';
import { clamp, matchWhen } from '../../core/helpers';
import appConfig from '../../../config/app';
import chalk from 'chalk';

function requestLogger(
	request: Request,
	response: Response,
	next: NextFunction,
): void {
	const startTime = Number(process.hrtime.bigint());

	const log = () => {
		const endTime = Number(process.hrtime.bigint());

		const totalTime = Number(((endTime - startTime) / 1_000_000).toFixed(2));
		const { method, originalUrl } = request;
		const { statusCode } = response;

		const terminalWidth = process.stdout.columns || 80;
		const decoratorsLength = `${method} ${statusCode}   ~ ${totalTime}ms`
			.length;
		const maximumRequestPathLength = Math.max(
			0,
			terminalWidth - decoratorsLength,
		);

		const requestInfo = `${method} ${formatStatus(statusCode)} ${formatUrlPath(originalUrl, maximumRequestPathLength)}`;

		const dotsCount = clamp(
			terminalWidth - originalUrl.length - decoratorsLength,
			0,
			maximumRequestPathLength,
		);
		const dots = dotsCount > 0 ? ` ${'.'.repeat(dotsCount)} ` : '... ';

		logData(`${requestInfo}${chalk.gray(dots)}~ ${formatTotalTime(totalTime)}`);

		response.removeListener('finish', log);
		response.removeListener('close', log);
	};

	/**
	 * Skip options call, as it is called before each request,
	 * and would lead to double logs per request.
	 */
	if (
		request.method !== 'OPTIONS' &&
		!request.path.startsWith('/.well-known')
	) {
		response.on('finish', log);
		response.on('close', log);
	}

	next();
}

function formatStatus(statusCode: number): string {
	const color = matchWhen(
		[
			[statusCode >= 500, () => chalk.red],
			[statusCode >= 400, () => chalk.yellow],
			[statusCode >= 300, () => chalk.white],
			[statusCode >= 200, () => chalk.green],
		],
		() => chalk.gray,
	);

	return color(statusCode);
}

function formatTotalTime(totalTime: number) {
	const color = matchWhen(
		[
			[totalTime >= 5000, () => chalk.red],
			[totalTime >= 500, () => chalk.yellow],
			[totalTime >= 10, () => chalk.gray],
		],
		() => chalk.white,
	);

	return color(`${totalTime}ms`);
}

function formatUrlPath(originalUrl: string, maxLength: number): string {
	const url = new URL(originalUrl, appConfig.url());
	const path = url.pathname;
	const query = url.search;

	if (path.length > maxLength) {
		return chalk.white(path.slice(0, maxLength));
	} else if (path.length + query.length > maxLength) {
		maxLength = maxLength - path.length;

		return `${chalk.white(path)}${chalk.gray(query.slice(0, maxLength))}`;
	}

	return `${chalk.white(path)}${chalk.gray(query)}`;
}

export default requestLogger;
