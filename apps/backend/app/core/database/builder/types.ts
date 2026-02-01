// src/core/builder/types.ts

export type SortDirection = 'asc' | 'desc';

export type WhereOperator =
  | '='
  | '!='
  | '<'
  | '<='
  | '>'
  | '>='
  | 'like'
  | 'not like'
  | 'in'
  | 'not in'
  | 'between'
  | 'contains'
  | 'startsWith'
  | 'endsWith';

/**
 * Defines the callback signature for nested queries.
 * Example: .where((query) => query.where('active', true))
 */
export type ScopeCallback<T> = (builder: T) => void;

/**
 * Generic Interface for a Prisma Model Delegate.
 * This ensures the builder works with any model (User, Post, etc.)
 */
export interface PrismaModelDelegate<T> {
  findMany(args?: any): Promise<T[]>;
  count(args?: any): Promise<number>;
  findFirst(args?: any): Promise<T | null>;
  findUnique(args?: any): Promise<T | null>;
}

/**
 * The structure returned by the paginate() method.
 */
export interface PaginatorResult<T> {
  pagination: {
    total: number;
    perPage: number;
    pageCount: number;
    currentPage: number;
  };
  data: T[];
}

export type FilterValue = number | string | Date | null | undefined;
