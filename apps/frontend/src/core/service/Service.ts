import { formatQuery } from '../../common/helpers';
import type { HttpMethod, Query } from '../../types/Common';

abstract class Service {
	fetch<T>(
		url: string,
		method: HttpMethod,
		query?: Query,
		body?: Record<string, any> | string | null,
		headers?: HeadersInit,
	): Promise<T>;

	async fetch(
		url: string,
		method: HttpMethod,
		query?: Query,
		body?: BodyInit | null,
		headers?: HeadersInit,
	): Promise<Response> {
		url = url + formatQuery(query);
		body =
			method === 'GET' ? undefined
			: body instanceof FormData ? body
			: JSON.stringify(body ?? {});

		const request = new Request(url, { 
			method,
			headers,
			body,
			credentials: 'include'
		 });

		return await fetch(request)
			.then((response: Response) => {
				return response;
			})
			.catch((error: Response) => {
				throw error;
			});
	}
}

export default Service;
