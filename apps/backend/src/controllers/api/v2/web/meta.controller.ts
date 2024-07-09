import { Request, Response, NextFunction } from "express";
import { WebSetting } from "../../../../models/web.model.js";

export const get = async (req: Request, res: Response, next: NextFunction) => {
  const WebSettingInstance = WebSetting.getInstance();
  const motd = await WebSettingInstance.getSetting("motd");

  try {
    res.status(200).json({ motd: motd, uptime: process.uptime() });
  } catch (e) {
    next(e);
  }
};
