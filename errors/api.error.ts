class ApiError extends Error {
  public handled: boolean = false;
  public statusCode: number = 400;

  constructor(message: string, statusCode?: number, handled?: boolean) {
    super(message);
    this.name = "ApiError";

    this.statusCode = statusCode ?? this.statusCode;
    this.handled = handled ?? this.handled;
  }
}

export class BadRequest extends ApiError {
  constructor(message: string) {
    super(message, 400, true);
    this.name = "BadRequest";
  }
}

export class Unauthorized extends ApiError {
  constructor(message: string) {
    super(message, 401, true);
    this.name = "Unauthorized";
  }
}

export class Forbidden extends ApiError {
  constructor(message: string) {
    super(message, 403, true);
    this.name = "Forbidden";
  }
}
