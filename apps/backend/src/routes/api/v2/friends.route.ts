import express, { Router } from "express";

import { get } from "../../../controllers/api/v2/friends.controller.js";

export const router: Router = express.Router();

router.get("/", get);