import { Request, Response, NextFunction } from "express";

import { clientID, clientSecret } from "../../index.js";
import { Account } from "../../models/account.model.js";
import { genSecureHexString } from "../../services/util.service.js";
import JwtService from "../../services/jwt.service.js";

export const post = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const formData = req.body;
    if (
      clientID !== Number(formData.client_id) ||
      clientSecret !== formData.client_secret
    ) {
      res.status(403).json({ message: "Forbidden" });
      return;
    } else {
      const contextUser = new Account(
        null,
        formData.username,
        formData.user_email
      );

      contextUser.validatePassword(formData.password).then((valid) => {
        if (!valid) {
          res.status(401).json({ message: "Unauthorized" });
          return;
        } else {
          const jwt: string = JwtService.getInstance().sign({
            aud: req.body.client_id,
            jti: genSecureHexString(80),
            iat: Math.floor(Date.now() / 1000),
            nbf: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 86400,
            sub: contextUser.getId(),
            scopes: ["*"],
          });

          res.status(200).json({
            access_token: jwt,
            expires_in: 86400,
            refresh_token: genSecureHexString(724),
            token_type: "Bearer",
          });
        }
      });
    }
  } catch (e) {
    console.error(`Error: ${e}`);
    next(e);
  }
};
