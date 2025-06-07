import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { upsertStreamUser } from "../lib/stream.js";

export const signUp = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be atleast 6 characters." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exixts." });
    }

    //generate a no between 1 to 100 for avatar
    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

    const newUser = await User.create({
      fullName,
      email,
      password,
      profilePic: randomAvatar,
    });

    //TODO: CREATE THIS USER IN STREAM AS WELL (SO THEY CAN HANDLE THE AUTHNETICATION PROPERLY)
    await upsertStreamUser({
      id: newUser._id.toString(),
      name: newUser.fullName,
      image: newUser.profilePic || "",
    });
    console.log(`Stream User Created for ${newUser.fullName}`);
    //generate the token now
    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({ success: true, user: newUser });
  } catch (error) {
    console.log("Error in Signup Controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Inavlid Credentials" });
    }

    const isPasswordCorrect = await user.matchPassword(password);

    if (!isPasswordCorrect) {
      return res.status(404).json({ message: "Invalid Credentials." });
    }

    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200), json({ success: true, user });
  } catch (error) {
    console.log("Error in login controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("jwt");
  res.status(200).json({ message: "User logged out successfully." });
};

export const onboard = async (req, res) => {
  try {
    const userId = req.user._id;
    const { fullName, bio, nativeLanguage, learningLanguage, location } =
      req.body;

    if (
      !fullName ||
      !bio ||
      !nativeLanguage ||
      !learningLanguage ||
      !location
    ) {
      return res.status(400).json({
        message: "All fields are required",
        missingFields: [
          !fullName && "fullName",
          !bio && "bio",
          !nativeLanguage && "nativeLanguage",
          !learningLanguage && "learningLanguage",
          !location && "location",
        ].filter(Boolean),
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...req.body,
        isOnboarded: true,
      },
      { new: true }
    );

    //UPDATE THE USER INFO IN STREAM
    try {
      await upsertStreamUser({
        id:updatedUser._id.toString(),
        name:updatedUser.fullName,
        image:updatedUser.profilePic || ""
      });
      console.log(`Stream User updated after onboarding for ${updatedUser.fullName}`);
    } catch (streamError) {
      console.log("Error Updating Stream User during onboarding: ",streamError.message);
    }

    res.status(200).json({success:true, user:updatedUser});
  } catch (error) {
    console.log("Error in onoboarding controller: ",error.message);
    res.status(500).json({message:"Internal Server Error."});
  };
};
