import express, { Router } from "express";
import multer, { Multer } from "multer";

import { get, post } from "../controllers/users.controller.js";

export const router: Router = express.Router();
const upload : Multer= multer()

router.get("/", get);

router.post("/", upload.any(), post);
