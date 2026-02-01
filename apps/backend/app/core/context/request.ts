import { AsyncLocalStorage } from 'node:async_hooks';
import { Request, Response, NextFunction } from 'express';

const storage = new AsyncLocalStorage<Request>();

export async function requestContext(
	request: Request,
	_: Response,
	next: NextFunction,
) {
	storage.run(request, () => {
		next();
	});
}

function request(): Request | undefined {
	return storage.getStore() as Request;
}

export default request;
