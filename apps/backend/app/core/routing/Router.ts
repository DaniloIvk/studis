import express from 'express';
import Controller from '../http/Controller';
import { requestContext } from '../context/request';
import { responseContext } from '../context/response';
import { currentUserContext } from '../context/currentUser';

type Constructor<T = any> = new (...args: any[]) => T;
type ControllerMethod<T> = keyof T & string;
type ControllerRouteHandler<T = any> = [Constructor<T>, ControllerMethod<T>];
type ExpressHandler = express.RequestHandler;

type PrismaDelegate = {
	readonly findUniqueOrThrow: (args: any) => Promise<any>;
};

type RouteBinding = {
	readonly param: string;
	readonly model: PrismaDelegate;
	readonly injectAs: string;
};

export type ResourceOptions = {
	readonly only?: readonly string[];
	readonly except?: readonly string[];
	readonly resolveIdAs?: PrismaDelegate;
};

class Router {
	private readonly router: express.Router;
	private middlewareStack: ExpressHandler[] = [];

	constructor() {
		this.router = express.Router();
	}

	public getRouter() {
		return this.router;
	}

	public middleware(handlers: ExpressHandler | ExpressHandler[]) {
		const middleware = Array.isArray(handlers) ? handlers : [handlers];
		this.middlewareStack.push(...middleware);
		return this;
	}

	private flushMiddleware(): ExpressHandler[] {
		const stack = [...this.middlewareStack];
		this.middlewareStack = [];
		return stack;
	}

	public get(
		path: string,
		handler: ControllerRouteHandler | ExpressHandler,
		binding?: RouteBinding,
	) {
		this.register('get', path, handler, binding);
	}

	public post(
		path: string,
		handler: ControllerRouteHandler | ExpressHandler,
		binding?: RouteBinding,
	) {
		this.register('post', path, handler, binding);
	}

	public put(
		path: string,
		handler: ControllerRouteHandler | ExpressHandler,
		binding?: RouteBinding,
	) {
		this.register('put', path, handler, binding);
	}

	public patch(
		path: string,
		handler: ControllerRouteHandler | ExpressHandler,
		binding?: RouteBinding,
	) {
		this.register('patch', path, handler, binding);
	}

	public delete(
		path: string,
		handler: ControllerRouteHandler | ExpressHandler,
		binding?: RouteBinding,
	) {
		this.register('delete', path, handler, binding);
	}

	public apiResource(
		name: string,
		controller: Constructor<Controller>,
		options: ResourceOptions = {},
	) {
		const resourceName = name.replace(/^\/+|\/+$/g, '');
		const basePath = `/${resourceName}`;

		const methods = this.filterMethods(
			['index', 'store', 'show', 'update', 'destroy'],
			options,
		);

		const modelName = this.singularize(resourceName);
		const singularPath = `${basePath}/:${modelName}`;

		let binding: RouteBinding | undefined;

		if (options.resolveIdAs) {
			binding = {
				param: modelName,
				model: options.resolveIdAs,
				injectAs: modelName,
			};
		}

		if (methods.includes('index')) {
			this.register('get', basePath, [controller, 'index'], undefined, false);
		}

		if (methods.includes('store')) {
			this.register('post', basePath, [controller, 'store'], undefined, false);
		}

		if (methods.includes('show')) {
			this.register('get', singularPath, [controller, 'show'], binding, false);
		}

		if (methods.includes('update')) {
			this.register(
				'put',
				singularPath,
				[controller, 'update'],
				binding,
				false,
			);
			this.register(
				'patch',
				singularPath,
				[controller, 'update'],
				binding,
				false,
			);
		}

		if (methods.includes('destroy')) {
			this.register(
				'delete',
				singularPath,
				[controller, 'destroy'],
				binding,
				false,
			);
		}

		this.flushMiddleware();
	}

	private singularize(word: string): string {
		function covertToCamelCase(word: string): string {
			return word.replace(
				/-([a-z])/g,
				(match: string) => match[1]?.toUpperCase() || '',
			);
		}

		word = covertToCamelCase(word);

		if (word.endsWith('ies')) {
			return word.slice(0, -3) + 'y';
		}
		if (word.endsWith('s')) {
			return word.slice(0, -1);
		}

		return word;
	}

	private register(
		method: 'get' | 'post' | 'put' | 'patch' | 'delete',
		path: string,
		handler: ControllerRouteHandler | ExpressHandler,
		binding?: RouteBinding,
		flushMiddleware: boolean = true,
	) {
		const middlewares =
			flushMiddleware ? this.flushMiddleware() : [...this.middlewareStack];

		const finalHandler =
			Array.isArray(handler) ?
				this.resolveControllerRoute(handler, binding)
			:	handler;

		this.router[method](
			path,
			...middlewares,
			currentUserContext,
			requestContext,
			responseContext,
			finalHandler,
		);
	}

	private resolveControllerRoute(
		handler: ControllerRouteHandler,
		binding?: RouteBinding,
	) {
		const [ControllerClass, method] = handler;

		return async (
			request: express.Request,
			response: express.Response,
			next: express.NextFunction,
		) => {
			try {
				const controllerInstance = new ControllerClass();

				if (typeof controllerInstance[method] !== 'function') {
					throw new Error(
						`Method '${method}' not found on controller '${ControllerClass.name}'`,
					);
				}

				const args: Record<string, any> = {
					request,
					response,
					next,
					...request.params,
				};

				if (binding && request.params[binding.param]) {
					const rawId = request.params[binding.param];
					const id = !isNaN(Number(rawId)) ? Number(rawId) : rawId;

					try {
						args[binding.injectAs] = await binding.model.findUniqueOrThrow({
							where: { id },
						});
					} catch (error: any) {
						if (error?.code === 'P2025') {
							return this.sendNotFound(request, response);
						}
						throw error;
					}
				}

				await controllerInstance[method](args);
			} catch (error) {
				next(error);
			}
		};
	}

	private sendNotFound(request: express.Request, response: express.Response) {
		response.status(404);

		if (request.accepts('json')) {
			return response.json({ message: 'Not Found' });
		}

		return response.send('Not Found');
	}

	private filterMethods(
		defaults: string[],
		options: ResourceOptions,
	): string[] {
		if (options.only) {
			return defaults.filter((method) => options.only!.includes(method));
		}
		if (options.except) {
			return defaults.filter((method) => !options.except!.includes(method));
		}
		return defaults;
	}
}

export default Router;
