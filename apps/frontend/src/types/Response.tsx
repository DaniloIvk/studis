import type { PaginatorData } from './Paginator';

export type GetOneResponse<T extends Record<string, any> = object> = {
  data: T;
};

export type CreateResponse<T extends Record<string, any> = object> = {
  message: string;
  data: T;
};

export type UpdateResponse<T extends Record<string, any> = object> = {
  message: string;
  data: T;
};

export type DeleteResponse = {
  message: string;
};

export type CommonResponse = {
  message: string;
};

export type ErrorResponse = {
  message: string;
  errors?: Record<string, string[]>;
};

export type EmptyResponse = {} | [] | '';

export type ApiResponse =
  | PaginatorData
  | GetOneResponse
  | CreateResponse
  | UpdateResponse
  | DeleteResponse
  | CommonResponse
  | ErrorResponse
  | EmptyResponse;
