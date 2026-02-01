import { AsyncLocalStorage } from 'node:async_hooks';
import { Request, Response, NextFunction } from 'express';
import { User } from 'database/prisma/client';

const storage = new AsyncLocalStorage<User>();

export async function currentUserContext(
	request: Request,
	_: Response,
	next: NextFunction,
) {
	const user = ('user' in request.session ? request.session.user : {}) as User;

	storage.run(user, () => {
		next();
	});
}

function currentUser(): User | undefined {
	return storage.getStore() as User;
}

export default currentUser;
