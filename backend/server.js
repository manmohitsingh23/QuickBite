import 'dotenv/config';

import express from "express";
import cors from "cors";

import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";

import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

 // Load .env variables

//app config
const app=express();
const port=4000

//middleware
app.use(express.json());
app.use(cors());

app.get("/",(req,res)=>{
    res.send("API working");
})

//db connection
connectDB();

//api endpoints

app.use("/api/food",foodRouter);
app.use("/images",express.static('uploads'));
app.use("/api/user",userRouter);
app.use("/api/cart",cartRouter);
app.use("/api/order",orderRouter);

app.listen(port,()=>{
    console.log(`server running on http://localhost:${port}`);
})