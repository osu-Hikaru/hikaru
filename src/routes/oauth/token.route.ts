import express, { Router } from "express";
import multer, { Multer } from "multer";


import { post } from "../../controllers/oauth/token.controller.js"

export const router: Router = express.Router();
const upload : Multer= multer()

router.post("/", upload.any(), post);
