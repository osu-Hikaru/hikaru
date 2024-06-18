import { Request, Response, NextFunction } from "express";

export const get = (req: Request, res: Response, next: NextFunction) => {
  try {
    res
      .status(200)
      .json({
        notification_endpoint: "wss://notify.hikaru.pw",
        notifications: [],
      });
  } catch (e) {
    next(e);
  }
};
