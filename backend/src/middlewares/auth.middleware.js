import User from "../models/User.js";
import jwt from "jsonwebtoken";


export const protectRoute = async (req,res,next)=>{
    try {
        const token=req.cookies.jwt;

        if(!token)
        {
            return res.status(401).json({message:"Unauthorized - No Token Provided"});
        }

        const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY);
        if(!decoded)
        {
            return res.status(401).json({message:"Unauthorized - Inavlid Token"});
        }

        const user=await User.findById(decoded.userId).select("-password");
        if(!user)
        {
            return res.status(401).json({message:"Unautorized - User Not Found"});
        }

        req.user=user;
        next();
    } catch (error) {
        console.log("Error in ProtectRoute Middleware: ",error.message);
        res.status(500).json({message:"Internal Server Error."});
    }
}