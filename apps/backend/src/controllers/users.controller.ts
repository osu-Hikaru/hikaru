import { Request, Response, NextFunction } from "express";

import { Account } from "../models/account.model.js";

export const post = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const formData = req.body;
    const contextUser = new Account();

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
  } catch (e) {
    next(e);
  }
};
