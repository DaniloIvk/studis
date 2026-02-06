import { Request } from 'express';
import { AsyncLocalStorage } from 'async_hooks';

export const requestContext = new AsyncLocalStorage<Request>();

export function currentUser() {
  const request = requestContext.getStore();
  return request?.session?.user;
}