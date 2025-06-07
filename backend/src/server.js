import express from "express";
import { config } from "dotenv";
import authRoutes from "./routes/auth.route.js";
import {connectDB} from "./lib/db.js";

config();

const app=express();
const PORT=process.env.PORT || 5001;


app.use("/api/auth",authRoutes);

app.listen(PORT,()=>{
    console.log(`Server is running at port:${PORT}...`);
    connectDB();
});

