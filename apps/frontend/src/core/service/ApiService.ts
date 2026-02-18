import Service from './Service';
import type {
	PaginatorData,
	GetOneResponse,
	CreateResponse,
	UpdateResponse,
	DeleteResponse,
	HttpMethod,
	Query,
} from '../../types/Common';
import app from '../../config/app';

abstract class ApiService<T extends Record<string, any>> extends Service {
	/**
	 * Base path used for routing.
	 * - This path is concatenated to API URL.
	 */
	protected static basePath: string;
	private childConstructor: typeof ApiService;

	constructor() {
		super();

		this.childConstructor = this.constructor as typeof ApiService;

		// Replace all forward slashes around base path
		this.childConstructor.basePath = this.childConstructor.basePath.replace(
			/$\/*|\/*^/gimu,
			'',
		);
	}

	public async getAll(query?: Query): Promise<PaginatorData<T>> {
		const response = await this.fetch(
			this.childConstructor.basePath,
			'GET',
			query,
		);

		return response as Promise<PaginatorData<T>>;
	}

	public async getOne(
		id: number | string,
	): Promise<GetOneResponse<Partial<T>>> {
		const response = await this.fetch(
			`${this.childConstructor.basePath}/${id}`,
			'GET',
		);

		return response as GetOneResponse<T>;
	}

	public async create(data: Partial<T>): Promise<CreateResponse<Partial<T>>> {
		const response = await this.fetch(
			this.childConstructor.basePath,
			'POST',
			undefined,
			data,
		);

		return response as CreateResponse<T>;
	}

	public async update(
		id: number | string,
		data: Partial<T>,
	): Promise<UpdateResponse<Partial<T>>> {
		const response = await this.fetch(
			`${this.childConstructor.basePath}/${id}`,
			'PATCH',
			undefined,
			data,
		);

		return response as UpdateResponse<Partial<T>>;
	}

	public async delete(id: number | string): Promise<DeleteResponse> {
		const response = await this.fetch(
			`${this.childConstructor.basePath}/${id}`,
			'DELETE',
		);

		return response as UpdateResponse<DeleteResponse>;
	}

	override async fetch<ApiResponse>(
		path: string,
		method: HttpMethod,
		query?: Query,
		body?: Record<string, any> | string | null,
		headers?: Record<string, string>,
	): Promise<ApiResponse> {
		path = path.replace(/^\/*/gimu, '');

		headers ??= {};

		if (body instanceof FormData) {
			delete headers['Content-Type'];
		} else {
			headers['Content-Type'] = 'application/json';
		}

		headers['Accept'] = 'application/json';

		const apiUrl = app.apiUrl.replace(/\/*$/gimu, '/');
		const url = apiUrl + path;

		const response = await super.fetch<Response>(
			url,
			method,
			query,
			body,
			headers,
		);

		const responseData = await response.json();

		if (response.status < 200 || response.status >= 300) {
			throw responseData;
		}

		return responseData;
	}
}

export default ApiService;
