import pkg from "jsonwebtoken";
import { Unauthorized, Forbidden } from "../errors/api.error.js";

const { TokenExpiredError, NotBeforeError, JsonWebTokenError } = pkg;

export class Service {
  constructor() {}

  protected identifyErrorType(error: any) {
    console.log(error)
    switch (error.constructor) {
      case TokenExpiredError:
      case NotBeforeError:
      case JsonWebTokenError:
        return this.handleKnownJWTError(error);
      default:
        return error;
    }
  }

  private handleKnownJWTError(error: any) {
    switch (error.constructor) {
      case TokenExpiredError:
        return new Unauthorized("Token has expired.");
      case NotBeforeError:
        return new Unauthorized("Token not yet valid.");
      case JsonWebTokenError:
        return new Unauthorized("Invalid token.");
      default:
        return error;
    }
  }
}
