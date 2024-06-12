import { Request, Response, NextFunction } from "express";
import { WebSetting } from "../../../../models/web.model.js";

export const get = async (req: Request, res: Response, next: NextFunction) => {
  const motd = (await new WebSetting("motd").fetchSetting()).getValue();

  try {
    res.status(200).json({ motd: motd, uptime: process.uptime() });
  } catch (e) {
    console.error(`Error: ${e}`);
    next(e);
  }
};
