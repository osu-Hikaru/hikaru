import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

import { DuplicateEntry } from "../errors/database.error.js";

export class DatabaseModel {
  constructor() {}

  identifyErrorType(error: any) {
    switch (error.constructor) {
      case PrismaClientKnownRequestError:
        return this.handleKnownDatabaseError(error);
      default:
        return error;
    }
  }

  handleKnownDatabaseError(error: PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        if (!error.meta) {
          return new DuplicateEntry(
            `A duplicate entry was found in the database for an unknown column.`,
            "unknown model"
          );
        } else {
          return new DuplicateEntry(
            `The ${error.meta.target} already exists.`,
            (error.meta.modelName ?? "unknown model").toString()
          );
        }
      default:
        return error;
    }
  }
}
