import { Request, Response, NextFunction } from "express";

import { User } from "../../../models/user.model.js";

export const get = (req: Request, res: Response, next: NextFunction) => {
  try {
    const contextUser = new User(req.body.jwt.sub)

    res.status(200).json({ id: contextUser.getId() });
  } catch (e) {
    console.error(`Error: ${e}`);
    next(e);
  }
};
