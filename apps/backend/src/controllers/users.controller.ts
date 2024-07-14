import { Request, Response, NextFunction } from "express";

import { Account } from "../models/account.model.js";
import { WebSetting } from "../models/web.model.js";

import { Forbidden } from "../errors/api.error.js";

export const post = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const formData = req.body;
    const contextUser = new Account();
    const settings = WebSetting.getInstance();

    if(await settings.getSetting("registrationEnabled") === "true") {
    await contextUser
      .registerUser(
        formData.user.username,
        formData.user.user_email,
        formData.user.password
      )
      .then(() => {
        res.status(200).json({});
      })
      .catch((err) => {
        next(err);
      });
    } else {
      throw new Forbidden("Registration is currently disabled.");
    }
  } catch (e) {
    next(e);
  }
};
