import { Request, Response, NextFunction } from "express";

import { User } from "../../../models/user.model.js";

export const get = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const searchParameter = req.url.split("/")[1];
    const contextUser = new User();

    contextUser.init(searchParameter);

    res.status(200).json(JSON.parse(contextUser.getObject()));
  } catch (e) {
    next(e);
  }
};
