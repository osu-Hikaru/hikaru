import { Request, Response, NextFunction } from "express";

import { SeasonalBackgroundsModel } from "../../../models/seasonal-backgrounds.model.js";

export const get = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const seasonalBackground =
      await SeasonalBackgroundsModel.getInstance().getBackgrounds();

    res.status(200).json(seasonalBackground);
  } catch (e) {
    next(e);
  }
};
