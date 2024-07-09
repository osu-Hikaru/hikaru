import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

import { DuplicateEntry } from "../errors/database.error.js";

import DatabaseService from "../services/db.service.js";

export class DatabaseModel {
  protected _databaseService: DatabaseService = DatabaseService.getInstance();

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

  protected package<T extends DatabaseModel>(instance: T): string {
    const returnObject: Record<string, any> = {};

    Object.entries(instance).forEach(([key, value]) => {
      if (key.startsWith("_")) {
        return;
      } else if (value instanceof DatabaseModel) {
        returnObject[key] = JSON.parse(value.package(value));
      } else {
        returnObject[key] = value;
        return;
      }
    });

    return JSON.stringify(returnObject);
  }
}
