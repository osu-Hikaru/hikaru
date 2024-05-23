import { Request, Response, NextFunction } from "express";

import { Account } from "../models/account.model.js";

export const get = (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({ message: "ok" });
  } catch (e) {
    console.error(`Error: ${e}`);
    next(e);
  }
};

export const post = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const formData = req.body;
    const contextUser = new Account(
      null,
      formData.user.username,
      formData.user.user_email
    );

    await contextUser
      .registerUser(formData.user.password)
      .then((account) => {
        res.status(200).send();
      })
      .catch((err) => {
        next(err);
      });
  } catch (e) {
    console.error(`Error: ${e}`);
    next(e);
  }
};
