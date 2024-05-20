import express, { Router } from "express";

import { router as tokenRouter } from "./oauth/token.route.js";

import { get } from "../controllers/oauth.controller.js";

export const router: Router = express.Router();

router.use("/token", tokenRouter);

router.get("/", get);
