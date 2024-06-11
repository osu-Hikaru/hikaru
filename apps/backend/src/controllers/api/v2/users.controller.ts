import { Request, Response, NextFunction } from "express";

import { User } from "../../../models/user.model.js";

export const get = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const searchParameter = req.url.split("/")[1];
    const searchKey = req.query.key;
    const contextUser = new User();

    switch (searchKey) {
      case "username":
        contextUser.setUsername(searchParameter);
        await contextUser.fetchUserByUsername(searchParameter);
        res.status(200).json(contextUser.getObject());
        break;
      case "id":
        contextUser.setId(Number(searchParameter));
        await contextUser.fetchUserById(Number(searchParameter));
        res.status(200).json(contextUser.getObject());
        break;
      default:
        res.status(400).json({ error: "Invalid or unknown search key" });
        break;
    }
  } catch (e) {
    console.error(`Error: ${e}`);
    next(e);
  }
};
