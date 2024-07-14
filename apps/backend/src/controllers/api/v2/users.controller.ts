import { Request, Response, NextFunction } from "express";

import { User } from "../../../models/user.model.js";

import { BadRequest } from "../../../errors/api.error.js";

export const get = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const searchParameter = req.query.ids || req.url.split("/")[1];
    let users;

    if (Array.isArray(searchParameter)) {
      users = [];

      for (const id of searchParameter) {
        if (isNaN(Number(id))) {
          throw new BadRequest("Invalid user ID");
        }

        const contextUser = new User();
        await contextUser.init(String(id));
        users.push(JSON.parse(contextUser.getObject()));
      }
    } else {
      if (isNaN(Number(searchParameter))) {
        throw new BadRequest("Invalid user ID");
      }

      const contextUser = new User();
      await contextUser.init(String(searchParameter));
      users = JSON.parse(contextUser.getObject());
    }

    res.status(200).json(users);
  } catch (e) {
    next(e);
  }
};
