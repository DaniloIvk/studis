import { AsyncLocalStorage } from 'node:async_hooks';
import { Request, Response, NextFunction } from 'express';

const storage = new AsyncLocalStorage<Response>();

export async function responseContext(
	_: Request,
	response: Response,
	next: NextFunction,
) {
	storage.run(response, () => {
		next();
	});
}

function response(): Response | undefined {
	return storage.getStore() as Response;
}

export default response;
