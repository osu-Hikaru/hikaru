import { readFileSync } from "node:fs";
import jwt from "jsonwebtoken";

export default class JwtService {
  private static instance: JwtService;
  private static key: Buffer;

  private constructor() {
    if (!JwtService.instance) {
      JwtService.instance = this;
    }

    JwtService.key = readFileSync("./keys/private.key");

    return JwtService.instance;
  }

  public sign(data: any): string {
    return jwt.sign(data, JwtService.key, { algorithm: "RS256" });
  }

  public static getInstance(): JwtService {
    if (!JwtService.instance) {
      JwtService.instance = new JwtService();
    }

    return JwtService.instance;
  }
}
