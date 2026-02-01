import z from 'zod';
import getRequest from '../context/request';
import database, { ExistsDelegate, WhereQuery } from '../database/database';
import {
	EnumContract,
	EnumHelpers,
	EnumLike,
	EnumValue,
} from '@daniloivk/ts-backed-enum';
import { transformToDate } from '../helpers';

type SchemaType =
	| z.ZodNumber
	| z.ZodBigInt
	| z.ZodString
	| z.ZodDate
	| z.ZodUUID
	| z.ZodEmail
	| z.ZodEmoji
	| z.ZodIPv4
	| z.ZodIPv6
	| z.ZodURL
	| z.ZodBase64
	| z.ZodBase64URL
	| z.ZodEnum
	| z.ZodAny
	| z.ZodCustom
	| z.ZodOptional
	| z.ZodNonOptional
	| z.ZodNullable
	| z.ZodPipe;

type StringLikeTypes =
	| z.ZodString
	| z.ZodEmail
	| z.ZodUUID
	| z.ZodEmoji
	| z.ZodIPv4
	| z.ZodIPv6
	| z.ZodURL
	| z.ZodBase64
	| z.ZodBase64URL;

type CastToType = typeof String | typeof Number | typeof Date;

/**
 * Fluent wrapper for Zod validation rules with custom messaging and shorthands.
 */
class Rule {
	private schema: SchemaType;
	private fieldName: string = 'field';

	constructor(schema: SchemaType) {
		this.schema = schema;
	}

	public setFieldName(fieldName: string) {
		this.fieldName = fieldName;
	}

	/**
	 * ################################## Rules based on input type ###################################
	 */
	public static number(): Rule {
		return new Rule(z.number());
	}

	public static integer(): Rule {
		return new Rule(z.int());
	}

	public static decimal(): Rule {
		return new Rule(z.float64());
	}

	public static string(): Rule {
		return new Rule(z.string());
	}

	public static date(): Rule {
		return new Rule(z.preprocess(transformToDate, z.date()));
	}

	public static uuid(
		version?: 'v1' | 'v2' | 'v3' | 'v4' | 'v5' | 'v6' | 'v7' | 'v8',
	): Rule {
		return new Rule(z.uuid((version = version)));
	}

	public static email(min: number = 6, max: number = 320): Rule {
		return new Rule(z.email().min(min).max(max));
	}

	public static password(min: number = 8, max: number = 64): Rule {
		return this.string()
			.lowercase(false)
			.uppercase(false)
			.numeric()
			.between(min, max);
	}

	public static phoneNumber(prefix: string = '\\+?'): Rule {
		const pattern = new RegExp(`^${prefix}\\d{3,}([ -]?\\d{3,})+$`);

		return new Rule(z.string().regex(pattern).min(6).max(15));
	}

	public static enum<EnumClass extends EnumLike>(
		enumClass: EnumContract<EnumClass, any> & EnumHelpers<EnumClass, any>,
	): Rule {
		return new Rule(
			z.enum(
				enumClass.values().map((value: EnumValue<EnumClass>) => String(value)),
			),
		);
	}

	public static file(): Rule {
		return new Rule(
			z.any().refine(
				(file: Express.Multer.File) => {
					if (!file) {
						return true;
					}

					return typeof file === 'object' && file.filename && file.mimetype;
				},
				{ params: { i18n: 'invalid_file' } },
			),
		);
	}

	/**
	 * ################################## Additional validation ###################################
	 */
	/**
	 * ---------------------------------- Common -----------------------------------
	 */
	public optional(): this {
		this.schema = this.schema.optional();
		return this;
	}

	public nullable(): this {
		this.schema = this.schema.nullable();
		return this;
	}

	public nullish(): this {
		this.schema = this.schema.nullish();
		return this;
	}

	public regex(pattern: RegExp, message?: string): this {
		this.schema = (this.schema as StringLikeTypes).regex(pattern, { message });

		return this;
	}

	public refine(
		callback: (value: any) => any,
		params?: {
			when?: ((payload: z.core.ParsePayload<unknown>) => boolean) | undefined;
			message?: string;
			params: { i18n?: string };
		},
	): this {
		this.schema = (this.schema as StringLikeTypes).refine(callback, params);

		return this;
	}

	/**
	 * ---------------------------------- String -----------------------------------
	 */
	public lowercase(matchWholeValue: boolean = true): this {
		if (matchWholeValue === true) {
			this.schema = (this.schema as StringLikeTypes).lowercase({
				i18n: 'lowercase_only',
			} as any) as SchemaType;
			return this;
		}

		return this.refine((value) => /[a-z]/gm.exec(value), {
			params: { i18n: 'lowercase' },
		});
	}

	public uppercase(matchWholeValue: boolean = true): this {
		if (matchWholeValue === true) {
			this.schema = (this.schema as StringLikeTypes).uppercase({
				i18n: 'uppercase_only',
			} as any) as SchemaType;
			return this;
		}

		return this.refine((value) => /[A-Z]/gm.exec(value), {
			params: { i18n: 'uppercase' },
		});
	}

	public numeric(matchWholeValue: boolean = false): this {
		if (matchWholeValue === true) {
			return this.refine((value) => /^[0-9]$/gm.exec(value), {
				params: { i18n: 'numeric_only' },
			});
		}

		return this.refine((value) => /[0-9]/gm.exec(value), {
			params: { i18n: 'numeric' },
		});
	}

	/**
	 * ---------------------------------- Comparison -----------------------------------
	 */
	/**
	 * ---------------------------------- Comparison -----------------------------------
	 */
	public min(min: number): this {
		this.conditionallyApplyRule('min', min);

		return this;
	}

	public max(max: number): this {
		this.conditionallyApplyRule('max', max);

		return this;
	}

	/**
	 * Shorthand for minimum and maximum length constraints.
	 */
	public between(min: number, max: number): this {
		return this.min(min).max(max);
	}

	/**
	 * ---------------------------------- Field specific -----------------------------------
	 */
	/**
	 * Enforces field confirmation by checking the request body for a matching '_confirmation' field.
	 */
	public confirmed(fieldName: string): this {
		this.fieldName = fieldName;

		this.schema = (this.schema as z.ZodType).refine(
			(value) => {
				const request = getRequest();
				const confirmationValue =
					request?.body[`${this.fieldName}Confirmation`]!;

				return value === confirmationValue;
			},
			{ params: { i18n: 'confirmed' } },
		) as SchemaType;

		return this;
	}

	/**
	 * ---------------------------------- Database related -----------------------------------
	 */
	public exists(
		table: string,
		column: string = 'id',
		additionalFilters: Record<string, any> = {},
		castToType: CastToType = String,
	): this {
		this.schema = (this.schema as z.ZodType).refine(
			(value) => {
				const model = (
					database[table as keyof typeof database] as unknown as ExistsDelegate
				).findFirst({
					where: { [column]: castToType(value), ...additionalFilters },
				});

				return Boolean(model);
			},
			{ params: { i18n: 'exists', table } },
		) as SchemaType;

		return this;
	}

	public notExist(
		table: string,
		column: string = 'id',
		additionalFilters: Record<string, any> = {},
		castToType: CastToType = String,
	): this {
		this.schema = (this.schema as z.ZodType).refine(
			(value) => {
				const model = (
					database[table as keyof typeof database] as unknown as ExistsDelegate
				).findFirst({
					where: { [column]: castToType(value), ...additionalFilters },
				});

				return !Boolean(model);
			},
			{ params: { i18n: 'exists', table } },
		) as SchemaType;

		return this;
	}

	public unique(
		table: string,
		column: string,
		additionalFilters: Record<string, any> = {},
		castToType: CastToType = String,
	) {
		this.schema = (this.schema as z.ZodType).refine(
			(value) => {
				const model = (
					database[table as keyof typeof database] as unknown as ExistsDelegate
				).findFirst({
					where: { [column]: castToType(value), ...additionalFilters },
				});

				return !Boolean(model);
			},
			{ params: { i18n: 'unique', table } },
		) as SchemaType;

		return this;
	}

	public uniqueWithIgnore(
		table: string,
		column: string,
		ignore?: object | string | number | Date | undefined,
		additionalFilters: Record<string, any> = {},
		castToType: CastToType = String,
	) {
		this.schema = (this.schema as z.ZodType).refine(
			async (value) => {
				if (ignore instanceof Object) {
					ignore = (ignore as any)[column]!;
				}

				const where: WhereQuery = {
					where: { [column]: castToType(value), ...additionalFilters },
				};

				if (ignore !== undefined) {
					where.where.NOT = { [column]: castToType(ignore) };
				}

				const databaseConnection = database[
					table as keyof typeof database
				] as unknown as ExistsDelegate;

				const model = await databaseConnection.findFirst(where);

				return !Boolean(model);
			},
			{ params: { i18n: 'unique', table } },
		) as SchemaType;

		return this;
	}

	/**
	 * ---------------------------------- Files related -----------------------------------
	 */
	/**
	 * Validates file size in bytes (e.g., 5 * 1024 * 1024 for 5MB).
	 */
	public maxSize(bytes: number): this {
		if (!(this.schema instanceof z.ZodAny)) {
			return this;
		}

		function formatFileSize(fileSize: number): string {
			const sizes = { 1: 'B', 2: 'KB', 3: 'MB', 4: 'GB', 5: 'TB', 6: 'PB' };

			let size = 1;

			while (fileSize > 1e3) {
				fileSize /= 1e3;
				size++;
			}

			return `${fileSize.toFixed(1).replace('.0', '')}${sizes[size as keyof typeof sizes]!}`;
		}

		this.schema = (this.schema as z.ZodType).refine<any>(
			(file: Express.Multer.File) => !file || file.size <= bytes,
			{ params: { i18n: 'file_too_large', max: formatFileSize(bytes) } },
		) as z.ZodAny;

		return this;
	}

	/**
	 * Validates allowed MIME types.
	 */
	public mimeTypes(types: string[]): this {
		if (!(this.schema instanceof z.ZodAny)) {
			return this;
		}

		this.schema = (this.schema as z.ZodType).refine<any>(
			(file: Express.Multer.File) => !file || types.includes(file.mimetype),
			{ params: { i18n: 'invalid_mime_type', allowed: types.join(', ') } },
		) as z.ZodAny;

		return this;
	}

	/**
	 * ---------------------------------- Conditional -----------------------------------
	 */
	public requiredIf(condition: boolean | string): this {
		if (condition === false) {
			return this;
		}

		if (condition === true) {
			this.schema = this.schema.nonoptional();
			return this;
		}

		const request = getRequest();

		if (!request) {
			return this;
		}

		const [field, expectedValue] = condition.split(':');
		const actualValue =
			request.body?.[field as string] ??
			request.query?.[field as string] ??
			request.params?.[field as string];

		if (String(actualValue) === expectedValue) {
			this.schema = (this.schema as z.ZodType).refine(
				(val) => val !== undefined && val !== null,
				{ params: { i18n: 'required' } },
			) as any;
		} else {
			this.optional();
		}

		return this;
	}

	public excludeIf(condition: boolean | string): this {
		const request = getRequest();
		let shouldExclude = false;

		if (typeof condition === 'boolean') {
			shouldExclude = condition;
		} else if (typeof condition === 'string' && request) {
			const [field, expectedValue] = condition.split(':');

			const actualValue =
				request.body?.[field as string] ??
				request.query?.[field as string] ??
				request.params?.[field as string];
			shouldExclude = String(actualValue) === expectedValue;
		}

		if (shouldExclude) {
			this.schema = this.schema = z
				.any()
				.transform(() => undefined)
				.optional() as any;
		}

		return this;
	}

	public when(
		condition: boolean,
		callable: (rule: this) => this,
		fallback?: (rule: this) => this,
	): this {
		if (condition === true) {
			return callable(this);
		} else if (fallback !== undefined) {
			return fallback(this);
		}

		return this;
	}

	/**
	 * ################################## Get the underlying schema ###################################
	 */
	/**
	 * Returns the underlying Zod schema.
	 */
	public assign(): z.ZodTypeAny {
		return this.schema.describe(this.fieldName).readonly();
	}

	/**
	 * Returns the underlying Zod schema.
	 */
	public build(fieldName: string): z.ZodTypeAny {
		this.fieldName = fieldName;

		return this.schema;
	}

	/**
	 * ################################## Helpers ###################################
	 */
	private conditionallyApplyRule(rule: string, ...params: any[]): this {
		if (rule in this.schema) {
			this.schema = (this.schema as any)[rule](...params);
		} else if (
			this.schema instanceof z.ZodOptional &&
			rule in this.schema.def.innerType
		) {
			this.schema = z.optional(
				(this.schema.def.innerType as any)[rule](...params),
			) as any;
		} else if (
			(this.schema instanceof z.ZodPipe ||
				this.schema instanceof z.ZodTransform) &&
			rule in this.schema.def.out._zod
		) {
			this.schema = z.optional(
				(this.schema.def.out._zod as any)[rule](...params),
			) as any;
		}

		return this;
	}
}

export default Rule;
