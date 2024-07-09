import { createHash } from "node:crypto";
import { genSaltSync, hashSync, compareSync } from "bcrypt";

import { accounts } from "@prisma/client";
import { DatabaseModel } from "./model.js";

export class Account extends DatabaseModel {
  private id: number | undefined;
  private username: string | undefined;
  private user_email: string | undefined;

  constructor() {
    super();
  }

  private comparePassword(password: string, hashedPassword: string): boolean {
    const sha256 = createHash("sha256").update(password);
    const digest = sha256.digest("hex");

    return compareSync(digest, hashedPassword);
  }

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
      } catch (e) {
        reject(e);
      }
    });
  }

  private getPassword(): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        this._databaseService
          .getClient()
          .accounts.findFirstOrThrow({
            where: {
              username: this.username,
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

  public async fetchAccountData(search: number | string): Promise<Account> {
    return new Promise(async (resolve, reject) => {
      try {
        let account;
        const dbService = this._databaseService.getClient();

        if (typeof search === "number") {
          account = await dbService.accounts.findFirst({
            where: {
              id: search,
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
          throw new Error("Account not found");
        }

        this.id = account.id;
        this.username = account.username;
        this.user_email = account.email;

        resolve(this);
      } catch (err) {
        reject(this.identifyErrorType(err));
      }
    });
  }

  public async validatePassword(password: string): Promise<boolean> {
    return this.comparePassword(password, await this.getPassword());
  }

  public getId(): number {
    return this.id ?? 0;
  }

  public getUsername(): string {
    return this.username ?? "";
  }

  public getUserEmail(): string {
    return this.user_email ?? "";
  }

  private validateUsernameParameters(username: string): boolean {
    return RegExp(/^[a-zA-Z0-9_]{3,16}$/).test(username);
  }

  private validatePasswordParameters(password: string): boolean {
    return RegExp(/.{8,}/).test(password);
  }

  public registerUser(
    username: string,
    user_email: string,
    password: string
  ): Promise<Account> {
    return new Promise(async (resolve, reject) => {
      try {
        if (username === undefined || user_email === undefined) {
          throw new Error("Username and email are required");
        } else if (
          !this.validateUsernameParameters(username) ||
          !this.validatePasswordParameters(password)
        ) {
          throw new Error("Invalid username or password");
        } else {
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

          this.id = registrationTransaction.id;
          this.username = username;
          this.user_email = user_email;

          resolve(this);
        }
      } catch (e) {
        reject(this.identifyErrorType(e));
      }
    });
  }
}
