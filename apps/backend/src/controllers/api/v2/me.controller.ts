import { Request, Response, NextFunction } from "express";

import { User } from "../../../models/user.model.js";

export const get = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const contextUser = new User(req.body.jwt.sub);

    await contextUser.fetchUser();

    res.status(200).json(contextUser.getObject());
  } catch (e) {
    console.error(`Error: ${e}`);
    next(e);
  }
};
