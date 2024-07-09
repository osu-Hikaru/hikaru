import express, { Router } from "express";

import { get, post } from "../../../../controllers/api/v2/web/settings.controller.js";

export const router: Router = express.Router();

router.get("/", get);

router.post("/", post);
