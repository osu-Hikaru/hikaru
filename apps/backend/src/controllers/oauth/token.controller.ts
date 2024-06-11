import { Request, Response, NextFunction } from "express";
import { Account } from "../../models/account.model.js";
import { genSecureHexString } from "../../services/util.service.js";
import JwtService from "../../services/jwt.service.js";

export const post = async (req: Request, res: Response, next: NextFunction) => {
  const formData = req.body;

  try {
    if (
      (process.env.CLIENT_ID ?? 0) !== Number(formData.client_id) ||
      (process.env.CLIENT_SECRET ?? "") !== formData.client_secret ||
      !formData.username ||
      !formData.password
    ) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }

    const contextUser = new Account(
      null,
      formData.username,
      formData.user_email
    );

    contextUser.validatePassword(formData.password).then((valid) => {
      if (!valid) {
        res.status(403).json({ message: "Forbidden" });
        return;
      }

      const expiry: number = Math.floor(Date.now() / 1000) + 86400;
      const jwt: string = JwtService.getInstance().sign({
        aud: req.body.client_id,
        jti: genSecureHexString(80),
        iat: Math.floor(Date.now() / 1000),
        nbf: Math.floor(Date.now() / 1000),
        exp: expiry,
        sub: contextUser.getId(),
        scopes: ["*"],
      });

      res.cookie("jwt", jwt, {
        maxAge: expiry,
      });

      res.status(200).json({
        access_token: jwt,
        expires_in: 86400,
        refresh_token: genSecureHexString(724),
        token_type: "Bearer",
      });
    });
  } catch (e) {
    console.error(`Error: ${e}`);
    next(e);
  }
};
