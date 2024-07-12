// Libraries
import express, { Router, Request, Response, NextFunction } from "express";

// Routes
import { router as v2Router } from "./api/v2.route.js";

// Services
import JwtService from "../services/jwt.service.js";

// Errors
import { Forbidden } from "../errors/api.error.js";

// Router definition
export const router: Router = express.Router();

router.use("*", (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check if the authorization header is provided
    if (!req.headers.authorization?.startsWith("Bearer ")) {
      throw new Forbidden("Invalid authorization header");
    }

    const token = req.headers.authorization?.split(" ")[1];

    // Check if the token is provided
    if (token === undefined) {
      throw new Forbidden("Invalid authorization header");
    }

    const jwt = JwtService.getInstance().verify(token);

    // Check if the token is valid
    if (jwt.sub === undefined) {
      throw new Forbidden("Invalid authorization header");
    } else {
      // Add the JWT to the request body
      if (req.body === undefined) {
        req.body = {};
      }

      req.body.jwt = jwt;
      next();
    }
  } catch (err: any) {
    throw new Error(err);
  }
});

router.use("/v2", v2Router);
