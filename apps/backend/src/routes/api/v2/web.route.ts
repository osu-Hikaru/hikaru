import express, { Router } from "express";

import { router as metaRouter } from "./web/meta.route.js";
import { router as settingsRouter } from "./web/settings.route.js";

export const router: Router = express.Router();

router.use("/meta", metaRouter);
router.use("/settings", settingsRouter);
