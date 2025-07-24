import express from "express";

import { loginUser,registerUser,resendOTP,verifyOTP } from "../controllers/userController.js";

const userRouter=express.Router();

userRouter.post('/register',registerUser);
userRouter.post('/login',loginUser);
userRouter.post('/verifyOTP',verifyOTP);
userRouter.post('/resendOTP',resendOTP);

export default userRouter;
