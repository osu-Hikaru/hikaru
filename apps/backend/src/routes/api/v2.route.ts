import express, { Router } from "express";

import { router as friendsRouter } from "./v2/friends.route.js";
import { router as meRouter } from "./v2/me.route.js";
import { router as notificationsRouter } from "./v2/notifications.route.js";
import {router as seasonalBackgroundsRouter} from "./v2/seasonal-backgrounds.route.js";
import { router as sessionRouter } from "./v2/session.route.js";
import { router as userRouter } from "./v2/users.route.js";
import { router as webRouter } from "./v2/web.route.js";

export const router: Router = express.Router();

router.use("/friends", friendsRouter);
router.use("/me", meRouter);
router.use("/notifications", notificationsRouter);
router.use("/seasonal-backgrounds", seasonalBackgroundsRouter);
router.use("/session", sessionRouter);
router.use("/users", userRouter);
router.use("/web", webRouter);
