import { createHash } from "node:crypto";
import { genSaltSync, hashSync, compareSync } from "bcrypt";

import { users } from "@prisma/client";

import DbService from "../services/db.service.js";

export class User {
  private id: number | null;
  private username: string;
  private user_email: string;

  constructor(id: number | null, username: string, user_email: string) {
    this.id = id;
    this.username = username;
    this.user_email = user_email;
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

  private comparePassword(password: string, hashedPassword: string): boolean {
    const sha256 = createHash("sha256").update(password);
    const digest = sha256.digest("hex");

    return compareSync(digest, hashedPassword);
  }

  public async validatePassword(password: string): Promise<boolean> {
    try {
      const userPassword = await this.getPassword();

      return this.comparePassword(password, userPassword);
    } catch (e) {
      console.error(`Error: ${e}`);
      return false;
    }
  }

  public getId(): string {
    return this.id ? this.id.toString() : "";
  }

  public getUsername(): string {
    return this.username;
  }

  public getUserEmail(): string {
    return this.user_email;
  }

  private getPassword(): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const dbService = DbService.getInstance();
        dbService
          .getClient()
          .users.findFirstOrThrow({
            where: {
              username: this.username,
            },
          })
          .then((user: users) => {
            this.id = user.id;
            resolve(user.password);
          });
      } catch (e) {
        reject(e);
      }
    });
  }

  public registerUser(password: string): Promise<User> {
    return new Promise(async (resolve, reject) => {
      try {
        const dbService = DbService.getInstance();
        dbService
          .getClient()
          .users.create({
            data: {
              username: this.username,
              email: this.user_email,
              password: await this.hashPassword(password),
            },
          })
          .then((user: users) => {
            resolve(new User(user.id, user.username, user.email));
          });
      } catch (e) {
        reject(e);
      }
    });
  }
}
