import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { getStreamToken } from "../controllers/chat.controller.js";

const router=express.Router();


//for generating a stream token which stream will use to authenticate users
router.get("/token", protectRoute, getStreamToken);

export default router;