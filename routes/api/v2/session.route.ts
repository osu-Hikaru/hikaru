import express, { Router } from "express";

import { router as sessionRouter } from "./session/verify.route.js";

export const router: Router = express.Router();

router.use("/verify", sessionRouter);
