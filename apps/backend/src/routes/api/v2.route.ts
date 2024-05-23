import express, { Router } from "express";

import { router as meRouter } from "./v2/me.route.js";
import { router as notificationsRouter } from "./v2/notifications.route.js";
import { router as friendsRouter } from "./v2/friends.route.js";
import { router as sessionRouter } from "./v2/session.route.js";

export const router: Router = express.Router();

router.use("/me", meRouter);
router.use("/notifications", notificationsRouter);
router.use("/friends", friendsRouter);
router.use("/session", sessionRouter);