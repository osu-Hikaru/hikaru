class DatabaseError extends Error {
  public model: string;
  public handled: boolean = false;
  public statusCode: number = 500;

  constructor(
    message: string,
    model: string,
    statusCode?: number,
    handled?: boolean
  ) {
    super(message);
    this.name = "DatabaseError";

    this.model = model;
    this.statusCode = statusCode ?? this.statusCode;
    this.handled = handled ?? this.handled;
  }
}

export class DuplicateEntry extends DatabaseError {
  constructor(message: string, model: string) {
    super(message, model, 409, true);
    this.name = "DuplicateEntry";
  }
}
