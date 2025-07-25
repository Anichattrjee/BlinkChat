import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { acceptFriendRequest, getFriendRequests, getMyFriends, getOutgoingFriendRequests, getRecommendedUsers, sendFriendRequest } from "../controllers/user.controller.js";

const router=express.Router();

//apply auth middleware to all routes
router.use(protectRoute);

router.get("/",getRecommendedUsers);
router.get("/friends",getMyFriends);

router.post("/friend-request/:id",sendFriendRequest);

//this id below is not a users id its a friendRequest Id
router.put("/friend-request/:id/accept",acceptFriendRequest);
router.get("/friend-requests",getFriendRequests);
router.get("/outgoing-friend-requests",getOutgoingFriendRequests);

export default router;