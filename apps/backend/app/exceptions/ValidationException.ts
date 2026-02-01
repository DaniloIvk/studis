export class ValidationException extends Error {
  public readonly status = 422;
  public readonly code = 'VALIDATION_ERROR';

  constructor(public readonly errors: Record<string, string[]>) {
    const fallbackMessage = 'The given data was invalid.';

    let errorMessage: string[] | string =
      Object.values(errors)[0] ?? fallbackMessage;

    if (Array.isArray(errorMessage)) {
      errorMessage = errorMessage[0] ?? fallbackMessage;
    }

    super(errorMessage);

    this.name = 'ValidationException';
  }
}
