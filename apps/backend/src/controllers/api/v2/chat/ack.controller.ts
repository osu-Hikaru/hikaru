import {NextFunction, Request, Response} from "express";

export const post = async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.status(200).json([]);
    } catch (e) {
        next(e);
    }
};
