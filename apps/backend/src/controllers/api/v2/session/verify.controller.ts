import { Request, Response, NextFunction } from "express";

export const post = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).send();
  } catch (e) {
    console.error(`Error: ${e}`);
    next(e);
  }
};
