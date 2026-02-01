// src/core/database/builder/QueryBuilder.ts

import { Request } from 'express';
import {
	FilterValue,
	PaginatorResult,
	PrismaModelDelegate,
	ScopeCallback,
	SortDirection,
	WhereOperator,
} from './types';

export class QueryBuilder<T, WhereInput extends Record<string, any> = any> {
	protected model: PrismaModelDelegate<T>;
	protected request: Request | undefined;

	/**
	 * Internal accumulator for Prisma arguments.
	 */
	protected queryAttributes: {
		where: WhereInput;
		include?: Record<string, any>;
		orderBy?: Record<string, SortDirection> | Record<string, SortDirection>[];
		select?: Record<string, boolean>;
		take?: number;
		skip?: number;
	};

	/**
	 * @param model The Prisma Model Delegate (e.g. prisma.user)
	 * @param request The Express Request object for auto-filtering
	 */
	constructor(model: PrismaModelDelegate<T>, request?: Request) {
		this.model = model;
		this.request = request;

		// Initialize "where" as an empty object typed as WhereInput
		this.queryAttributes = { where: {} as WhereInput };
	}

	/* -------------------------------------------------------------------------- */
	/* SELECTors                                                                  */
	/* -------------------------------------------------------------------------- */

	/**
	 * Set the fields to be returned by the query.
	 * - Note: Using select will automatically disable any previous includes,
	 *  as Prisma does not support both simultaneously.
	 * @param fields Array of field names or a selection object
	 */
	public select(fields: Array<keyof T> | Record<keyof T, boolean>): this {
		if (Array.isArray(fields)) {
			const selectMap: Record<string, boolean> = {};
			fields.forEach((field) => {
				selectMap[field as string] = true;
			});
			this.queryAttributes.select = selectMap;
		} else {
			this.queryAttributes.select = fields as Record<string, boolean>;
		}

		// Clean up include if select is used, as Prisma doesn't allow both
		delete this.queryAttributes.include;

		return this;
	}

	/* -------------------------------------------------------------------------- */
	/* BASIC FILTERS (Laravel Style)                                              */
	/* -------------------------------------------------------------------------- */

	/**
	 * Add a basic WHERE clause.
	 * @param field The database column name
	 * @param value The value to match
	 */
	public where(field: keyof WhereInput, value: any): this;

	/**
	 * Add a basic WHERE clause with an operator.
	 * @param field The database column name
	 * @param operator The operator (=, >, <, like, etc.)
	 * @param value The value to match
	 */
	public where(
		field: keyof WhereInput,
		operator: WhereOperator,
		value: any,
	): this;

	/**
	 * Add a nested WHERE clause (grouped AND).
	 * @param callback A function that receives a builder instance
	 */
	public where(callback: ScopeCallback<this>): this;

	public where(
		fieldOrCallback: keyof WhereInput | ScopeCallback<this>,
		operatorOrValue?: WhereOperator | any,
		value?: any,
	): this {
		if (typeof fieldOrCallback === 'function') {
			return this.addNestedCondition('AND', fieldOrCallback);
		}

		const { operator, finalValue } = this.resolveOperatorAndValue(
			operatorOrValue,
			value,
		);

		this.applyCondition('AND', fieldOrCallback as string, operator, finalValue);

		return this;
	}

	/**
	 * Add an OR WHERE clause.
	 */
	public orWhere(field: keyof WhereInput, value: any): this;
	public orWhere(
		field: keyof WhereInput,
		operator: WhereOperator,
		value: any,
	): this;
	public orWhere(callback: ScopeCallback<this>): this;
	public orWhere(
		fieldOrCallback: keyof WhereInput | ScopeCallback<this>,
		operatorOrValue?: WhereOperator | any,
		value?: any,
	): this {
		if (typeof fieldOrCallback === 'function') {
			return this.addNestedCondition('OR', fieldOrCallback);
		}

		const { operator, finalValue } = this.resolveOperatorAndValue(
			operatorOrValue,
			value,
		);

		this.applyCondition('OR', fieldOrCallback as string, operator, finalValue);

		return this;
	}

	/**
	 * Add a WHERE NOT clause.
	 * Equivalent to: .where('status', '!=', 'active')
	 */
	public whereNot(field: keyof WhereInput, value: any): this {
		return this.where(field, '!=', value);
	}

	/* -------------------------------------------------------------------------- */
	/* ADVANCED FILTERS                                                           */
	/* -------------------------------------------------------------------------- */

	public whereIn(field: keyof WhereInput, values: any[]): this {
		return this.where(field, 'in', values);
	}

	public whereNotIn(field: keyof WhereInput, values: any[]): this {
		return this.where(field, 'not in', values);
	}

	public whereBetween(field: keyof WhereInput, range: [any, any]): this {
		return this.where(field, 'between', range);
	}

	public whereNull(field: keyof WhereInput): this {
		return this.where(field, '=', null);
	}

	public whereNotNull(field: keyof WhereInput): this {
		return this.where(field, '!=', null);
	}

	public whereLike(field: keyof WhereInput, value: string): this {
		return this.where(field, 'contains', value);
	}

	public whereStartsWith(field: keyof WhereInput, value: string): this {
		return this.where(field, 'startsWith', value);
	}

	public whereEndsWith(field: keyof WhereInput, value: string): this {
		return this.where(field, 'endsWith', value);
	}

	/* -------------------------------------------------------------------------- */
	/* DATE FILTERS                                                               */
	/* -------------------------------------------------------------------------- */

	/**
	 * Filter by a specific date.
	 */
	public whereDate(
		field: keyof WhereInput,
		operator: '>' | '>=' | '<' | '<=' | '=',
		date: Date | string,
	): this {
		return this.where(field, operator, date);
	}

	/* -------------------------------------------------------------------------- */
	/* REQUEST DATE FILTERS                                                       */
	/* -------------------------------------------------------------------------- */

	/**
	 * Filter by a specific date or date range from request.
	 */
	public filterDateRangeFromRequest(
		dateFromField: keyof WhereInput = 'createdAt',
		dateToField: keyof WhereInput = 'createdAt',
	): this {
		const dateFromValue = String(
			this.extractRequestValue(dateFromField as string) ?? '',
		);
		const dateToValue = String(
			this.extractRequestValue(dateToField as string) ?? '',
		);

		if (dateFromValue) {
			const dateFromDate = new Date(dateFromValue);
			dateFromDate.setHours(0, 0, 0, 0);

			this.whereDate(dateFromField, '>=', dateFromDate);
		}
		if (dateToValue) {
			const dateToDate = new Date(dateFromValue);
			dateToDate.setHours(23, 59, 59, 999);

			this.whereDate(dateToField, '<=', dateToValue);
		}

		return this;
	}

	/* -------------------------------------------------------------------------- */
	/* ORDERING                                                                   */
	/* -------------------------------------------------------------------------- */

	/**
	 * Order results by a field. Defaults to ASC.
	 */
	public orderBy(field: string, direction: SortDirection = 'asc'): this {
		this.pushOrderBy(field, direction);
		return this;
	}

	/**
	 * Explicitly order results by Descending.
	 * No second argument needed.
	 */
	public orderByDesc(field: string): this {
		this.pushOrderBy(field, 'desc');
		return this;
	}

	/* -------------------------------------------------------------------------- */
	/* REQUEST SORTING                                                            */
	/* -------------------------------------------------------------------------- */

	/**
	 * Automatically apply sorting based on request parameters.
	 *
	 * @param allowedFields Array of field names allowed for sorting.
	 * @param config Optional configuration for param keys and defaults.
	 */
	public sortFromRequest(
		allowedFields: Array<keyof WhereInput>,
		config: {
			sortKey?: string;
			orderKey?: string;
			defaultField?: keyof WhereInput;
			defaultDirection?: SortDirection;
		} = {},
	): this {
		if (!this.request) return this;

		const {
			sortKey = 'sort',
			orderKey = 'order',
			defaultField,
			defaultDirection = 'asc',
		} = config;

		// Use safe helper to get values
		const sortValue = String(this.extractRequestValue(sortKey) ?? '');
		const orderValue = String(this.extractRequestValue(orderKey) ?? '');

		// Validate if the sort field is allowed
		if (sortValue && (allowedFields as string[]).includes(sortValue)) {
			const direction: SortDirection =
				orderValue?.toLowerCase() === 'desc' ? 'desc' : 'asc';

			return this.orderBy(sortValue, direction);
		}

		// Fallback to default
		if (defaultField) {
			return this.orderBy(defaultField as string, defaultDirection);
		}

		return this;
	}

	/* -------------------------------------------------------------------------- */
	/* REQUEST & CONDITIONAL LOGIC                                                */
	/* -------------------------------------------------------------------------- */

	/**
	 * Apply a callback if the value is truthy.
	 */
	public when(
		value: any,
		callback: (builder: this, value: any) => void,
		defaultCallback?: (builder: this) => void,
	): this {
		if (value) {
			callback(this, value);
		} else if (defaultCallback) {
			defaultCallback(this);
		}
		return this;
	}

	/**
	 * Check request query/body for a key and apply a WHERE condition if found.
	 */
	public filterFromRequest(
		requestKey: string | (string & keyof WhereInput),
		databaseField?: keyof WhereInput,
		operator: WhereOperator = '=',
		transform?: (value: any) => FilterValue,
	): this {
		let value = this.extractRequestValue(requestKey);
		const targetField = databaseField || (requestKey as keyof WhereInput);

		return this.when(value, (query) => {
			if (transform) {
				value = transform(value);

				if (value) {
					query.where(targetField, operator, value);
				}
			} else {
				query.where(targetField, operator, value);
			}
		});
	}

	/**
	 * Check request query/body for a key and apply a WHERE IN condition.
	 * Useful for checkboxes or multi-selects (?status[]=1&status[]=2)
	 */
	public filterInFromRequest(
		requestKey: string,
		databaseField?: keyof WhereInput,
		transform?: (value: any) => FilterValue,
	): this {
		const value = this.extractRequestValue(requestKey);
		const targetField = databaseField || (requestKey as keyof WhereInput);

		return this.when(value, (query) => {
			let arrayValue = Array.isArray(value) ? value : [value];

			if (transform) {
				arrayValue = arrayValue.map((value: FilterValue) => transform(value));

				if (value) {
					query.whereIn(targetField, arrayValue);
				}
			} else {
				query.whereIn(targetField, arrayValue);
			}
		});
	}

	/**
	 * Check request query/body for a key and apply a WHERE BETWEEN condition.
	 * Useful for numbers like grades, scores and such.
	 * - When only one of the values is passed it will be used to filter
	 * data from/to that value.
	 */
	public filterBetweenFromRequest(
		requestFromKey: string,
		requestToKey: string,
		databaseField: keyof WhereInput,
	): this {
		const fromValue = this.extractRequestValue(requestFromKey);
		const toValue = this.extractRequestValue(requestToKey);

		if (!(fromValue && toValue)) {
			return this;
		} else if (!fromValue && toValue) {
			return this.where(databaseField, '<=', toValue);
		} else if (fromValue && !toValue) {
			return this.where(databaseField, '>=', fromValue);
		}

		return this.whereBetween(databaseField, [fromValue, toValue]);
	}

	/**
	 * Check request query/body for a key and apply a WHERE condition if found.
	 */
	public filterEnumFromRequest<Enum extends object>(
		requestKey: string | (string & keyof WhereInput),
		enumClass: Enum,
		databaseField?: keyof WhereInput,
		operator: WhereOperator = '=',
	): this {
		let value: FilterValue | FilterValue[] | Enum[keyof Enum] =
			this.extractRequestValue(requestKey);
		const targetField = databaseField || (requestKey as keyof WhereInput);

		if (!value || !(typeof value === 'string' && value in enumClass)) {
			return this;
		}

		value = enumClass[value as keyof Enum];

		return this.where(targetField, operator, value);
	}

	/**
	 * Check request query/body for a key and apply a WHERE condition if found.
	 */
	public filterEnumInFromRequest<Enum extends object>(
		requestKey: string | (string & keyof WhereInput),
		enumClass: Enum,
		databaseField?: keyof WhereInput,
	): this {
		let value = this.extractRequestValue(requestKey);
		const targetField = databaseField || (requestKey as keyof WhereInput);

		if (!value) {
			return this;
		} else if (!Array.isArray(value)) {
			value = [value];
		}

		if (
			!value.every((value) => typeof value === 'string' && value in enumClass)
		) {
			return this;
		}

		const values = value.map((value) => enumClass[value as keyof Enum]);
		return this.whereIn(targetField, values);
	}

	/* -------------------------------------------------------------------------- */
	/* SEARCH SCOPE                                                               */
	/* -------------------------------------------------------------------------- */

	/**
	 * Apply a global search filter across multiple fields.
	 * Logic: (field1 LIKE %val% OR field2 LIKE %val% ...)
	 *
	 * @param fields Array of database fields to search in.
	 * @param requestKey The key in the request query to look for. Defaults to 'search'.
	 */
	public search(
		fields: Array<keyof WhereInput>,
		requestKey: string = 'search',
	): this {
		const value = this.extractRequestValue(requestKey);

		// If no search term is present, do nothing and return builder
		if (!value) return this;

		// We wrap this in a .where() callback to ensure it creates a nested group.
		return this.where((builder) => {
			fields.forEach((field) => {
				builder.orWhere(field, 'contains', value);
			});
		});
	}

	/* -------------------------------------------------------------------------- */
	/* RELATIONS                                                                  */
	/* -------------------------------------------------------------------------- */

	public include(relation: string, shouldInclude: boolean = true): this {
		if (shouldInclude) {
			if (!this.queryAttributes.include) {
				this.queryAttributes.include = {};
			}
			this.queryAttributes.include[relation] = true;
		}
		return this;
	}

	/* -------------------------------------------------------------------------- */
	/* EXECUTION (Paginate & Get)                                                 */
	/* -------------------------------------------------------------------------- */

	/**
	 * Execute the query and return a simple array (no pagination).
	 */
	public async get(): Promise<T[]> {
		return this.model.findMany(this.queryAttributes);
	}

	/**
	 * Execute the query and return the first result.
	 */
	public async first(): Promise<T | null> {
		return this.model.findFirst(this.queryAttributes);
	}

	/**
	 * Execute the query with Pagination.
	 */
	public async paginate(
		perPage: number = 10,
		page?: number,
	): Promise<PaginatorResult<T>> {
		// Determine Page safely using the helper
		const requestPage = Number(this.extractRequestValue('page')) || 1;

		const actualPage = page || requestPage;
		const currentPage = Math.max(Math.min(actualPage, Number.MAX_VALUE), 1);

		// Calculate Skip/Take
		const take = perPage;
		const skip = (currentPage - 1) * perPage;

		const executionAttributes = { ...this.queryAttributes, take, skip };

		const [total, data] = await Promise.all([
			this.model.count({ where: this.queryAttributes.where }),
			this.model.findMany(executionAttributes),
		]);

		const pageCount = Math.ceil(total / perPage);

		return { pagination: { total, perPage, pageCount, currentPage }, data };
	}

	/* -------------------------------------------------------------------------- */
	/* INTERNAL HELPERS                                                           */
	/* -------------------------------------------------------------------------- */

	/**
	 * Safe method to extract values from Request Query or Body.
	 * Priority: Query -> Body
	 */
	private extractRequestValue(key: string): FilterValue | FilterValue[] {
		if (!this.request) {
			return undefined;
		}

		const multiselectKey = `${key}[]`;
		const { query = {}, body = {} } = this.request;

		return (
			query[key] ?? body[key] ?? query[multiselectKey] ?? body[multiselectKey]
		);
	}

	private resolveOperatorAndValue(operatorOrValue: any, value: any) {
		if (value !== undefined) {
			return { operator: operatorOrValue as WhereOperator, finalValue: value };
		}
		return { operator: '=' as WhereOperator, finalValue: operatorOrValue };
	}

	private pushOrderBy(field: string, direction: SortDirection) {
		if (!this.queryAttributes.orderBy) {
			this.queryAttributes.orderBy = [];
		}
		const sortObject = { [field]: direction };

		if (Array.isArray(this.queryAttributes.orderBy)) {
			this.queryAttributes.orderBy.push(sortObject);
		} else {
			this.queryAttributes.orderBy = [
				this.queryAttributes.orderBy as any,
				sortObject,
			];
		}
	}

	private addNestedCondition(
		logic: 'AND' | 'OR',
		callback: ScopeCallback<this>,
	): this {
		const nestedBuilder = new QueryBuilder<T, WhereInput>(
			this.model,
			this.request,
		);
		callback(nestedBuilder as any);

		const nestedWhere = nestedBuilder.queryAttributes.where;

		if (Object.keys(nestedWhere).length > 0) {
			this.pushToLogicArray(logic, nestedWhere);
		}

		return this;
	}

	private applyCondition(
		logic: 'AND' | 'OR',
		field: string,
		operator: WhereOperator,
		value: any,
	) {
		const prismaCondition = this.mapToPrisma(field, operator, value);
		const whereClause = this.queryAttributes.where as Record<string, any>;

		if (logic === 'AND' && !whereClause[field]) {
			this.queryAttributes.where = {
				...whereClause,
				...prismaCondition,
			} as WhereInput;
		} else {
			this.pushToLogicArray(logic, prismaCondition);
		}
	}

	private pushToLogicArray(logic: 'AND' | 'OR', condition: any) {
		const whereClause = this.queryAttributes.where as Record<string, any>;

		if (!whereClause[logic]) {
			whereClause[logic] = [];
		}
		whereClause[logic].push(condition);
	}

	private mapToPrisma(field: string, operator: WhereOperator, value: any): any {
		switch (operator) {
			case '=':
				return { [field]: value };
			case '!=':
				return { [field]: { not: value } };
			case '>':
				return { [field]: { gt: value } };
			case '>=':
				return { [field]: { gte: value } };
			case '<':
				return { [field]: { lt: value } };
			case '<=':
				return { [field]: { lte: value } };
			case 'like':
			case 'contains':
				return { [field]: { contains: value } };
			case 'startsWith':
				return { [field]: { startsWith: value } };
			case 'endsWith':
				return { [field]: { endsWith: value } };
			case 'in':
				return { [field]: { in: value } };
			case 'not in':
				return { [field]: { notIn: value } };
			case 'between':
				return { [field]: { gte: value[0], lte: value[1] } };
			default:
				return { [field]: value };
		}
	}
}
