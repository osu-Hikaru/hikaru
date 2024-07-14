import express, { Router } from "express";

import { get } from "../../controllers/web/meta.controller.js";

export const router: Router = express.Router();

router.get("/", get);
