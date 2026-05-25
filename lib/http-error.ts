export class RequestError extends Error {
  statusCode: number;
  errors?: Record<string, string[]>;

  constructor(
    message: string,
    statusCode: number,
    errors?: Record<string, string[]>,
  ) {
    super(message); // parent class error
    this.statusCode = statusCode;
    this.errors = errors;
    this.name = "RequestError";
  }
}
export class ValidationError extends RequestError {
  constructor(fieldErrors: Record<string, string[]>) {
    const message = ValidationError.formatefieldError(fieldErrors);
    super(message, 400, fieldErrors);
    this.name = "ValidationError";
    this.errors = fieldErrors;
  }
  static formatefieldError(errors: Record<string, string[]>): string {
    const formattedMessage = Object.entries(errors).map(([field, messages]) => {
      const fieldnName = field.charAt(0).toUpperCase() + field.slice(1);
      if (messages[0] === "Required") {
        return `${fieldnName} is required`;
      }
      return messages.join(" and ");
    });
    return formattedMessage.join(", ");
  }
}
export class NotFoundError extends RequestError {
  constructor(resource: string) {
    super(`${resource} not found`, 404);
    this.name = "NotFoundError";
  }
}
export class ForbiddenError extends RequestError {
  constructor(message: string = "Forbidden") {
    super(message, 403);
    this.name = "ForbiddenError";
  }
}
export class UnauthorizedError extends RequestError {
  constructor(message: string = "Unauthorized") {
    super(message, 401);
    this.name = "UnauthorizedError";
  }
}
