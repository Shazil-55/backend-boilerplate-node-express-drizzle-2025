/* eslint-disable max-classes-per-file */
//
export class AppError extends Error {
  statusCode: number;

  constructor(code: number, message: string) {
    super(message);
    this.statusCode = code;

    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class BadRequest extends AppError {
  constructor(message: string) {
    super(400, message);

    Object.setPrototypeOf(this, BadRequest.prototype);
  }
}

export class NotFound extends AppError {
  constructor(message?: string) {
    super(404, message || 'Not Found');

    Object.setPrototypeOf(this, NotFound.prototype);
  }
}

export class InternalErrorMsg extends AppError {
  constructor(message?: string) {
    super(500, message || 'Internal Error');

    Object.setPrototypeOf(this, InternalErrorMsg.prototype);
  }
}

export class PermissionsError extends AppError {
  constructor(message?: string) {
    super(403, message || 'Permissions Error');

    Object.setPrototypeOf(this, PermissionsError.prototype);
  }
}
