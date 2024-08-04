import express, {Router} from "express";

import {router as ackRoute} from "./chat/ack.route.js";

export const router: Router = express.Router();

router.use("/ack", ackRoute);
