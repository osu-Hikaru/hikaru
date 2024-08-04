import express, { Router } from "express";

import { router as metaRouter } from "./web/meta.route.js";

export const router: Router = express.Router();

router.use("/meta", metaRouter);
