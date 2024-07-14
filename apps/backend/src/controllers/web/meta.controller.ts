import { Request, Response, NextFunction } from "express";
import { WebSetting } from "../../models/web.model.js";

export const get = async (req: Request, res: Response, next: NextFunction) => {
  const WebSettingInstance = WebSetting.getInstance();

  try {
    res.status(200).json({
      settings: Object.fromEntries((await WebSettingInstance.getSettings()).entries()),
      uptime: process.uptime(),
    });
  } catch (e) {
    next(e);
  }
};

