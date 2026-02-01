export * from './Paginator';
export * from './Response';
export * from './Table';
export * from './Form/Form';
export type { Query } from './Query';

export type Constructor<T> = new (...args: any[]) => T;

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
