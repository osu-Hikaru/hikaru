// Libraries
import { genSaltSync, hashSync, compareSync } from "bcrypt";
import { createHash } from "node:crypto";

// Models
import { DatabaseModel } from "./model.js";

// Prisma
import { accounts } from "@prisma/client";

// Errors
import { BadRequest, Unauthorized } from "../errors/api.error.js";
import { UnknownEntry } from "../errors/database.error.js";

/**
 * Represents an account in the system.
 */
export class Account extends DatabaseModel {
  private id: number | undefined;
  private username: string | undefined;
  private user_email: string | undefined;

  constructor() {
    super();
  }

  /**
   * Registers a new user with the provided username, email, and password.
   *
   * @param username - The username of the user.
   * @param user_email - The email address of the user.
   * @param password - The password of the user.
   * @returns A Promise that resolves to the created Account object.
   * @throws BadRequest if any of the required parameters are missing or if the provided username, email, or password is invalid.
   */
  public registerUser(
    username: string,
    user_email: string,
    password: string
  ): Promise<Account> {
    return new Promise(async (resolve, reject) => {
      try {
        // Check if the required parameters are provided
        if (
          username === undefined ||
          user_email === undefined ||
          password === undefined
        ) {
          // If any of the required parameters are missing, throw a BadRequest error
          throw new BadRequest("Username, email and password are required");
        } /* Validate the username, email, and password parameters */ else {
          const validUsername = this.validateUsernameParameters(username);
          const validEmail = this.validateEmailParameters(user_email);
          const validPassword = this.validatePasswordParameters(password);

          // If any of the parameters are invalid, throw a BadRequest error
          if (!validUsername || !validEmail || !validPassword) {
            const invalidFields = [];

            if (!validUsername) {
              invalidFields.push("username");
            }

            if (!validEmail) {
              invalidFields.push("email");
            }

            if (!validPassword) {
              invalidFields.push("password");
            }

            const message = `Invalid ${invalidFields.join(", ")}.`;
            throw new BadRequest(message);
          } /* If all parameters are valid, proceed with registration */ else {
            // Open a database transaction and attempt to create the account
            const dbService = this._databaseService.getClient();

            const registrationTransaction = await dbService.$transaction(
              async (tx) => {
                const account = await tx.accounts.create({
                  data: {
                    username: username,
                    email: user_email,
                    password: await this.hashPassword(password),
                  },
                });

                await tx.users.create({
                  data: {
                    account_id: account.id,
                  },
                });

                return account;
              }
            );

            // If the account was created successfully, resolve with the Account object
            this.id = registrationTransaction.id;
            this.username = username;
            this.user_email = user_email;

            resolve(this);
          }
        }
      } catch (e) {
        reject(this.identifyErrorType(e));
      }
    });
  }

  /**
   * Validates the parameters for the username.
   * @param username - The username to be validated.
   * @returns A boolean indicating whether the username is valid or not.
   */
  private validateUsernameParameters(username: string): boolean {
    return RegExp(/^[a-zA-Z0-9_]{3,16}$/).test(username);
  }

  /**
   * Validates the parameters of an email address.
   *
   * @param email - The email address to validate.
   * @returns A boolean indicating whether the email address is valid or not.
   */
  private validateEmailParameters(email: string): boolean {
    return RegExp(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/).test(
      email
    );
  }

  /**
   * Validates the parameters of the password.
   *
   * @param password - The password to be validated.
   * @returns A boolean indicating whether the password parameters are valid.
   */
  private validatePasswordParameters(password: string): boolean {
    return RegExp(/.{8,}/).test(password);
  }

  /**
   * Hashes the provided password in SHA256 and BCrypt and returns the hashed password.
   * @param password - The password to be hashed.
   * @returns A Promise that resolves with the hashed password.
   * @throws If an error occurs during the hashing process.
   */
  private hashPassword(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const sha256 = createHash("sha256").update(password);
        const digest = sha256.digest("hex");

        const salt = genSaltSync(10);
        const hashedPassword = hashSync(digest, salt);

        if (compareSync(digest, hashedPassword)) {
          resolve(hashedPassword);
        } else {
          reject("Hashed password does not match");
        }
      } catch (err) {
        reject(this.identifyErrorType(err));
      }
    });
  }

  /**
   * Retrieves an account based on the provided search parameter.
   * @param search - The search parameter to find the account. It can be either a number or a string.
   * @returns A Promise that resolves to the retrieved Account object.
   */
  public async getAccount(search: number | string): Promise<Account> {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await this.fetchAccountData(search);

        if (!user) {
          throw new UnknownEntry("Incorrect username or password", "account");
        } else {
          resolve(user);
        }
      } catch (err) {
        reject(this.identifyErrorType(err));
      }
    });
  }

  /**
   * Fetches account data based on the provided search parameter.
   * @param search - The search parameter to find the account. It can be either the account ID or the username.
   * @returns A Promise that resolves to an Account object.
   * @throws UnknownEntry - If the account is not found.
   */
  private async fetchAccountData(
    search: number | string
  ): Promise<Account | null> {
    return new Promise(async (resolve, reject) => {
      try {
        const dbService = this._databaseService.getClient();
        let account;

        if (
          (typeof search === "string" && parseInt(search)) ||
          typeof search === "number"
        ) {
          account = await dbService.accounts.findFirst({
            where: {
              id: Number(search),
            },
          });
        } else {
          account = await dbService.accounts.findFirst({
            where: {
              username: search,
            },
          });
        }

        if (!account) {
          resolve(null);
        } else {
          this.id = account.id;
          this.username = account.username;
          this.user_email = account.email;

          resolve(this);
        }
      } catch (err: any) {
        reject(this.handleKnownDatabaseError(err));
      }
    });
  }

  /**
   * Retrieves the password for the specified username or the current instance's username.
   * @param username - Optional. The username for which to retrieve the password. If not provided, the password for the current instance's username will be retrieved.
   * @returns A Promise that resolves with the password string.
   * @throws If there is an error retrieving the password.
   */
  private getPassword(username?: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const workingUsername = username ?? this.username;

      try {
        this._databaseService
          .getClient()
          .accounts.findFirstOrThrow({
            where: {
              username: workingUsername,
            },
          })
          .then((account: accounts) => {
            this.id = account.id;
            resolve(account.password);
          })
          .catch((e) => {
            reject(e);
          });
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * Compares a plain text password with a hashed password.
   * @param password - The plain text password to compare.
   * @param hashedPassword - The hashed password to compare against.
   * @returns `true` if the passwords match, `false` otherwise.
   */
  private comparePassword(password: string, hashedPassword: string): boolean {
    const sha256 = createHash("sha256").update(password);
    const digest = sha256.digest("hex");

    return compareSync(digest, hashedPassword);
  }

  /**
   * Validates the provided password against the account's stored password.
   * @param password - The password to validate.
   * @returns A Promise that resolves to a boolean indicating whether the password is valid.
   */
  public async validatePassword(password: string): Promise<boolean> {
    return this.comparePassword(password, await this.getPassword());
  }

  /**
   * Returns the ID of the account.
   * If the ID is null or undefined, it returns 0.
   * @returns The ID of the account.
   */
  public getId(): number {
    return this.id ?? 0;
  }

  /**
   * Gets the username of the account.
   * @returns The username of the account, or an empty string if it is not set.
   */
  public getUsername(): string {
    return this.username ?? "";
  }

  /**
   * Retrieves the email of the user.
   * @returns The email of the user.
   */
  public getUserEmail(): string {
    return this.user_email ?? "";
  }
}
