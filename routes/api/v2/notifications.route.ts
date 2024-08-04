import express, { Router } from "express";

import { get } from "../../../controllers/api/v2/notifications.controller.js";

export const router: Router = express.Router();

router.get("/", get);
