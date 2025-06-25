import FriendRequest from "../models/FriendRequest.js";
import User from "../models/User.js";

export const getRecommendedUsers = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const currentUser = req.user;

    //find the users who are not current user's friends and exclude the current user
    const recommendedUsers = await User.find({
      $and: [
        { _id: { $ne: currentUserId } }, //excluding the current user
        { _id: { $nin: currentUser.friends } }, //excluding friends
        { isOnboarded: true }, //getting on people who have onboarded
      ],
    });

    res.status(200).json(recommendedUsers);
  } catch (error) {
    console.log("Error in getRecommendedUsers controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getMyFriends = async (req, res) => {
 try {
    const user = await User.findById(req.user.id)
      .select("friends")
      .populate("friends", "fullName profilePic nativeLanguage learningLanguage");

    res.status(200).json(user.friends);
  } catch (error) {
    console.error("Error in getMyFriends controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const sendFriendRequest = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id: recipientId } = req.params;

    //prevent sending request to yourself

    if (myId === recipientId) {
      return res
        .status(400)
        .json({ message: "Cant send friend request to yourself" });
    }

    const recipient = await User.findById(recipientId);

    //check if the recipeint id is correct
    if (!recipient) {
      return res.status(404).json({ message: "Recipient Not Found" });
    }
    //check if already friends with the user
    if (recipient.friends.includes(myId)) {
      return res
        .status(400)
        .json({ message: "You are already friends with this user." });
    }

    //check is a req already exists
     // check if a req already exists
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: myId, recipient: recipientId },
        { sender: recipientId, recipient: myId },
      ],
    });

    if (existingRequest) {
      
      return res.status(400).json({
        message: "A request already exists between you and this user.",
      });
    }

    //create the friend request
    const friendRequest = await FriendRequest.create({
      sender: myId,
      recipient: recipientId,
    });

    res.status(201).json(friendRequest);
  } catch (error) {
    console.log("Error in sendFriendRequest controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const acceptFriendRequest = async (req, res) => {
  try {
    const { id: requestId } = req.params;

    const friendRequest = await FriendRequest.findById(requestId);

    if (!friendRequest) {
      return res.status(404).json({ message: "Friend Request Not Found" });
    }

    //check if current user is the recipient
    if (friendRequest.recipient.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to accept this request." });
    }

    //update the friendRequest
    friendRequest.status = "accepted";
    await friendRequest.save();

    //add each user to the other's friends array

    //adding myself as a friend to sender's friends array
    await User.findByIdAndUpdate(friendRequest.sender, {
      $addToSet: { friends: friendRequest.recipient },
    });

    //adding sender as a friend to my friends array
    await User.findByIdAndUpdate(friendRequest.recipient, {
      //addToSet: adds element to the array only if they do not exist there
      $addToSet: { friends: friendRequest.sender },
    });
  } catch (error) {
    console.log("Error in acceptFriendRequest Controller: ",error.message);
        res.status(500).json({message:"Internal Server Error."});
  }
};

export const getFriendRequests=async(req,res)=>{
    try {
        const incomingRequests=await FriendRequest.find({
            recipient:req.user.id,
            status:"pending"
        }).populate("sender","fullName profilePic nativeLanguage learningLanguage");

        const acceptedRequests=await FriendRequest.find({
            sender:req.user.id,
            status:"accepted"
        }).populate("recipient", "fullName profilePic");

        res.status(200).json({incomingRequests,acceptedRequests});
    } catch (error) {
        console.log("Error in getFriendRequests Controller: ",error.message);
        res.status(500).json({message:"Internal Server Error."});
    }
};

export const getOutgoingFriendRequests=async(req,res)=>{
    try {
        const outgoingRequests=await FriendRequest.find({
            sender:req.user.id,
            status:"pending"
        }).populate("recipient","fullName profilePic nativeLanguage learningLanguage");

        res.status(200).json(outgoingRequests);
    } catch (error) {
        console.log("Error in outgoingRequests Controller: ",error.message);
        res.status(500).json({message:"Internal Server Error."});
    }
}