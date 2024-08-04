import express, { Router } from "express";

import { post } from "../../../../controllers/api/v2/chat/ack.controller.js";

export const router: Router = express.Router();

router.post("/", post);
