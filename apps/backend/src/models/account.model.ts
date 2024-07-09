import { createHash } from "node:crypto";
import { genSaltSync, hashSync, compareSync } from "bcrypt";

import { accounts } from "@prisma/client";
import { DatabaseModel } from "./model.js";

export class Account extends DatabaseModel {
  private id: number | null;
  private username: string;
  private user_email: string;

  constructor(id: number | null, username: string, user_email: string) {
    super();
    this.id = id;
    this.username = username;
    this.user_email = user_email;
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

  public async validatePassword(password: string): Promise<boolean> {
    return this.comparePassword(password, await this.getPassword());
  }

  public getId(): number {
    return this.id ?? 0;
  }

  public getUsername(): string {
    return this.username;
  }

  public getUserEmail(): string {
    return this.user_email;
  }

  public registerUser(password: string): Promise<Account> {
    return new Promise(async (resolve, reject) => {
      try {
        const account = await this._databaseService
          .getClient()
          .$transaction(async (tx) => {
            const account = await tx.accounts.create({
              data: {
                username: this.username,
                email: this.user_email,
                password: await this.hashPassword(password),
              },
            });

            if (account.id === undefined) {
              throw new Error("Account ID is undefined");
            }

            const user = await tx.users.create({
              data: {
                account_id: account.id,
              },
            });

            return account;
          });

        this.id = account.id;

        resolve(this);
      } catch (err) {
        reject(this.identifyErrorType(err));
      }
    });
  }
}
