import { Request, Response, NextFunction } from "express";

export const get = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json([]);
  } catch (e) {
    next(e);
  }
};
