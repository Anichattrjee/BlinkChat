import express from "express";
import { config } from "dotenv";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js"
import {connectDB} from "./lib/db.js";
import cookieParser from "cookie-parser";

config();

const app=express();
const PORT=process.env.PORT || 5001;

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth",authRoutes);
app.use("/api/auth",userRoutes);

app.listen(PORT,()=>{
    console.log(`Server is running at port:${PORT}...`);
    connectDB();
});

