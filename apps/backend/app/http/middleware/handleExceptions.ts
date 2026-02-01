import { NextFunction, Request, Response } from 'express';
import { ValidationException } from '../../exceptions/ValidationException';
import { logErrors } from '../../core/logging/helpers';

export default function handleExceptions(
  error: Error,
  request: Request,
  response: Response,
  _: NextFunction
): Response {
  // 1. Handle Validation Exceptions (422)
  if (error instanceof ValidationException) {
    if (request.accepts('json') || request.path.startsWith('/api')) {
      return response.status(422).json({
        message: error.message,
        errors: error.errors,
      });
    }

    // For HTML requests, you might redirect back with errors (Laravel style)
    // return response.redirect('back');
    return response.status(422).send(error.message);
  }

  // 2. Handle Standard Errors (500)
  logErrors(error); // Log the full stack trace for internal errors

  const statusCode = (error as any).status || 500;

  if (request.accepts('json') || request.path.startsWith('/api')) {
    return response.status(statusCode).json({
      message: error.message || 'Server Error',
    });
  }

  return response.status(statusCode).send('Server Error');
}
