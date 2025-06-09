import express from "express";
import { protectRoute } from "../middlewares/auth.middleware";
import { acceptFriendRequest, getMyFriends, getRecommendedUsers, sendFriendRequest } from "../controllers/usser.controller";

const router=express.Router();

//apply auth middleware to all routes
router.use(protectRoute);

router.get("/",getRecommendedUsers);
router.get("/friends",getMyFriends);

router.post("/friend-request/:id",sendFriendRequest);

//this id below is not a users id its a friendRequest Id
router.put("/friend-request/:id/accept",acceptFriendRequest);


export default router;