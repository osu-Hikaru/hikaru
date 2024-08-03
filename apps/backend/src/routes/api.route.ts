// Libraries
import express, {NextFunction, Request, Response, Router} from "express";

// Routes
import {router as v2Router} from "./api/v2.route.js";

// Services
import JwtService from "../services/jwt.service.js";

// Errors
import {BadRequest, Unauthorized} from "../errors/api.error.js";

// Router definition
export const router: Router = express.Router();

router.use("*", (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization || req.cookies.jwt;

        // Check if the authorization header is provided
        if (!authHeader) {
            throw new Unauthorized("Authorization header is required");
        }

        let token;

        // Check if the authorization header is provided
        if (!req.headers.authorization?.startsWith("Bearer ")) {
            token = authHeader;
        } else {
            token = req.headers.authorization?.split(" ")[1];
        }

        // Check if the token is provided
        if (token === undefined) {
            throw new BadRequest("No authorization token provided");
        }

        const jwt = JwtService.getInstance().verify(token);

        // Check if the token is valid
        if (jwt instanceof Error) {
            throw jwt;
        } else {
            // Check if the token is within the permission scope for the API
            if (jwt.scopes.indexOf("*") < 0 && jwt.scopes.indexOf("api") < 0) {
                throw new Unauthorized("Request out of permission scope");
            }

            // Add the JWT to the request body
            if (req.body === undefined) {
                req.body = {};
            }

            req.body.jwt = jwt;
            next();
        }
    } catch (err: any) {
        next(err);
    }
});

router.use("/v2", v2Router);
