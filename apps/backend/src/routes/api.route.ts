import express, { Router, Request, Response, NextFunction } from "express";

import { router as v2Router } from "./api/v2.route.js";
import JwtService from "../services/jwt.service.js";

export const router: Router = express.Router();

router.use("*", (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.headers.authorization?.startsWith("Bearer ")) {
      res.status(403).json({ message: "Forbidden" });
      return;
    } else {
      const token = req.headers.authorization?.split(" ")[1];
      if (token === undefined) {
        res.status(403).json({ message: "Forbidden" });
        return;
      } else {
        const jwt = JwtService.getInstance();
        const decoded = jwt.verify(token);

        if (decoded.sub === undefined) {
          res.status(401).json({ message: "Unauthorized" });
          return;
        } else {
          if (req.body === undefined) {
            req.body = {};
          }

          req.body.jwt = decoded;
          next();
        }
      }
    }
  } catch (e) {
    console.error(`Error: ${e}`);
    res.status(500).json({ message: "Internal server error." });
    return;
  }
});

router.use("/v2", v2Router);
