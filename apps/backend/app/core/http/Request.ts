import fs from 'node:fs';
import z, { file } from 'zod';
import getRequest from '../context/request';
import getResponse from '../context/response';
import { ValidationException } from '../../exceptions/ValidationException';
import Container from '../../core/container/Container';
import database, { ExistsDelegate } from '../database/database';
import Rule from '../validation/Rule';
import { TFunction } from 'i18next';

/**
 * Zod validation rules mapping.
 */
export type ValidationRules = Record<string, Rule | z.ZodType>;

/**
 * Abstract Form Request to handle input validation and sanitization.
 */
abstract class FormRequest<InputData extends object = {}> {
	/**
	 * Whether validation should stop after the first failure.
	 */
	protected static stopOnFirstFailure: boolean = true;

	/**
	 * Whether to strip fields not defined in the rules.
	 */
	protected static stripUnknown: boolean = true;

	/**
	 * Translation function from i18next.
	 */
	public t: TFunction;

	/**
	 * The validated and sanitized data.
	 */
	protected validatedData: InputData = {} as InputData;

	/**
	 * The raw input data from the request.
	 */
	private readonly rawData: InputData;

	constructor() {
		const request = getRequest();

		this.rawData = this.resolveRequestData();
		this.t = request?.['t'] as TFunction;
	}

	/**
	 * Factory method to resolve and validate the request.
	 */
	public static async validate<T extends FormRequest<any>>(
		this: new () => T,
	): Promise<T> {
		const instance = Container.make(this);
		await instance.process();
		return instance;
	}

	/**
	 * Define the validation rules.
	 */
	protected abstract rules(): ValidationRules | Promise<ValidationRules>;

	/**
	 * Executes the validation lifecycle.
	 */
	private async process(): Promise<void> {
		const preparedData = this.prepareForValidation(this.rawData);

		const response = getResponse();

		response?.on('finish', () => {
			this.cleanupTempFiles(response);
		});

		await this.runValidation(preparedData);
	}

	/**
	 * Resolves the request data from the global context.
	 */
	private resolveRequestData(): InputData {
		const request = getRequest();

		if (!request) {
			throw new Error('FormRequest initialized outside of request context.');
		}

		const data = {
			...(request.body || {}),
			...(request.query || {}),
			...(request.params || {}),
		};

		if (request.file) {
			data[request.file.fieldname as keyof InputData] = file;
		}
		if (request.files) {
			if (Array.isArray(request.files)) {
				request.files.forEach((file) => {
					data[file.fieldname] = file;
				});
			} else {
				for (const key in request.files) {
					data[key] = request.files[key];
				}
			}
		}

		return data as InputData;
	}

	/**
	 * Validates the data against the Zod schema.
	 */
	private async runValidation(data: InputData): Promise<void> {
		const constructor = this.constructor as typeof FormRequest;

		const rawRules = await this.rules();
		const compiledRules: Record<string, z.ZodTypeAny> = {};

		for (const fieldName in rawRules) {
			let rule = rawRules[fieldName] as Rule | z.ZodType;

			if (rule instanceof Rule) {
				rule = rule.build(fieldName);
			}

			compiledRules[fieldName] = rule.describe(fieldName).readonly();
		}

		let schema: z.ZodObject<any> = z.object(compiledRules);

		if (!constructor.stripUnknown) {
			schema = schema.loose();
		}

		const result = await schema.safeParseAsync(data);

		if (!result.success) {
			this.handleFailure(result.error);
		} else {
			this.validatedData = this.transformValidatedData(
				result.data as InputData,
			) as InputData;
		}
	}

	/**
	 * Handles validation failures and throws a ValidationException.
	 */
	private handleFailure(error: z.ZodError): void {
		const constructor = this.constructor as typeof FormRequest;
		const issues = error.issues;

		if (constructor.stopOnFirstFailure) {
			const firstIssue = issues[0]!;
			const field = firstIssue.path.join('.') || 'error';
			const message = firstIssue.message;

			throw new ValidationException({ [field]: [message] });
		}

		const formattedErrors: Record<string, string[]> = {};

		for (const issue of issues) {
			const field = issue.path.join('.') || 'error';
			const message = issue.message;

			if (!formattedErrors[field]) {
				formattedErrors[field] = [];
			}

			formattedErrors[field].push(message);
		}

		throw new ValidationException(formattedErrors);
	}

	/**
	 * Hook to modify data before validation.
	 */
	protected prepareForValidation(data: InputData): InputData {
		if (data instanceof FormData) {
			return Object.fromEntries(data.entries()) as unknown as InputData;
		}

		return data;
	}

	/**
	 * Hook to modify data after validation.
	 */
	protected transformValidatedData<T extends InputData>(data: T): unknown {
		return data;
	}

	/**
	 * Delete any temp files uploaded for current request.
	 */
	private cleanupTempFiles(request: any): void {
		const files =
			request.file ? [request.file]
			: request.files ? Object.values(request.files).flat()
			: [];

		files.forEach((file: any) => {
			if (fs.existsSync(file.path)) {
				fs.unlinkSync(file.path);
			}
		});
	}

	/**
	 * Returns all validated data.
	 */
	public validated(): InputData {
		return this.validatedData;
	}

	/**
	 * Returns all request data, including not-validated data.
	 */
	public all(): InputData {
		return this.rawData;
	}

	/**
	 * Returns a specific validated input value.
	 */
	public input<T>(
		key: string,
		fallback?: T,
	): InputData[keyof InputData] | T | undefined {
		return (
			this.validatedData[key as keyof typeof this.validatedData] ?? fallback
		);
	}

	/**
	 * Get a route parameter from request URL.
	 */
	public routeParameter<T>(parameter: string, fallback?: T) {
		const request = getRequest();

		return request?.params[parameter] ?? fallback ?? undefined;
	}

	/**
	 * Get a route parameter from request URL.
	 */
	public async routeModel<T>(
		table: string,
		column: string = 'id',
		parameter?: string,
		fallback?: T,
	): Promise<object | string | undefined> {
		const parameterValue = this.routeParameter(parameter ?? table);

		if (!parameterValue) {
			return fallback!;
		}

		const model = await (
			database[table as keyof typeof database] as unknown as ExistsDelegate
		).findFirst({
			where: {
				[column]:
					Array.isArray(parameterValue) ? { IN: parameterValue }
					: isNaN(Number(parameterValue)) ? String(parameterValue)
					: Number(parameterValue),
			},
		});

		return model ?? fallback!;
	}
}

export default FormRequest;
