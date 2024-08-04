import express, { Router } from "express";

import { router as settingsRouter } from "./web/settings.route.js";

export const router: Router = express.Router();

router.use("/settings", settingsRouter);
