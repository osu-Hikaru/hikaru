import { readFileSync } from "node:fs";
import pkg from "jsonwebtoken";

const { verify: jwtVerify, sign: jwtSign } = pkg;

export default class JwtService {
  private static instance: JwtService;
  private static private_key: Buffer;
  private static public_key: Buffer;

  private constructor() {
    if (!JwtService.instance) {
      JwtService.instance = this;
    }

    JwtService.private_key = readFileSync("./keys/private.key");
    JwtService.public_key = readFileSync("./keys/public.key");

    return JwtService.instance;
  }

  public sign(data: any): string {
    return jwtSign(data, JwtService.private_key, { algorithm: "RS256" });
  }

  public verify(jwt: string): any {
    return jwtVerify(jwt, JwtService.public_key)
  }

  public static getInstance(): JwtService {
    if (!JwtService.instance) {
      JwtService.instance = new JwtService();
    }

    return JwtService.instance;
  }
}
