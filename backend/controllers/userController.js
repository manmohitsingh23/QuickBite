import dotenv from 'dotenv';
dotenv.config();
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";

import bcrypt from "bcrypt";

import validator from "validator";
import nodemailer from 'nodemailer';
import UserOTPVerification from "../models/UserOTPVerificationModel.js";


// console.log("tempusercheck:",process.env.STRIPE_SECRET_KEY,{ expiresIn: '1d' });


const createToken=(id)=>{
    console.log(process.env.JWT_SECRET);
    console.log(process.env.STRIPE_SECRET_KEY);
    return jwt.sign({id},process.env.JWT_SECRET);
}

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
    service: 'gmail', // or any other email service
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS
    }
});



//login user

const loginUser=async(req,res)=>{
    const {email,password}=req.body;
    try {
        const user=await userModel.findOne({email:email});
        console.log(user);

        if(!user){
            return res.json({success:false,message:"User doesn't exist"})
        }

        const isMatch=await bcrypt.compare(password,user.password);

        if(!isMatch){
            return res.json({success:false,message:"Invalid Credentials"});
        }

        const token=createToken(user._id);
        console.log(token);
        res.json({success:true,token});
    } catch (error) {
        console.log(error);
        return res.json({success:false,message:"Error"});
    }
}


//register user
const registerUser=async(req,res)=>{
    try {
        const {name,password,email}=req.body;

        //checking if user already exists
        const exists=await userModel.findOne({email:email});
        if(exists){
            return res.json({success:false,message:"User already exists"})
        }

        //validating email format and strong password
        if(!validator.isEmail(email)){
            return res.json({success:false,message:"Please enter valid email"});
        }

        if(password.length < 8){
            return res.json({success:false,message:"Please enter strong pssword"})
        }

        // now before creating the account we need to encrypt the password
        //hashing
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);

        const newUser=new userModel({
            name:name,
            email:email,
            password:hashedPassword,
            isVerified:false,
        });

        const user=await newUser.save();
        console.log("user : ",user)
        // const token=createToken(user._id);

        await sendOTPVerificationEmail({ _id: user._id, email: user.email },res);

        // return res.json({success:true,message: "OTP verification email sent."});

    } catch (error) {
        console.log(error);
        return res.json({success:false,message:"Error"});
    }
}

// Function to send OTP email
const sendOTPVerificationEmail = async ({_id,email},res) => {
    try {
        const otp = `${Math.floor(1000 + Math.random() * 9000)}`; // Generate a 4-digit OTP

        const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: email,
            subject: 'Your OTP Code for Verification',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #f4f4f4;">
                    <h2 style="text-align: center; color: #4CAF50;">OTP Verification</h2>
                    <p>Dear user,</p>
                    <p>Thank you for registering. Please use the following OTP to complete your verification:</p>
                    <h3 style="text-align: center; color: #333;">${otp}</h3>
                    <p style="text-align: center;">This OTP is valid for the next 5 minutes.</p>
                    <p>If you did not request this, please ignore this email.</p>
                    <p style="text-align: center; color: #888;">Thank you for choosing our service.</p>
                </div>
            `
        };

        //deleting all the previous otp before sending a new one
        await UserOTPVerification.deleteMany({_id});

        //hash the otp
        const saltRounds=10;
        const hashedOTP=await bcrypt.hash(otp,saltRounds);

        const newOTPVerification=new UserOTPVerification({
            userId:_id,
            otp:hashedOTP,
            createdAt:Date.now(),
            expiredAt:Date.now() + 1 * 60 * 1000,
        })

        await newOTPVerification.save();

        await transporter.sendMail(mailOptions);
        console.log('OTP email sent successfully');
        console.log("userId:",_id);
        res.json({
            success:true,
            message:"Verification otp email sent",
            data:{
                userId:_id,
                email,
            }
        })
        
    } catch (error) {
        console.error("Error sending OTP email:", error);
        res.json({
            success:false,
            message:error.message,
        });
    }
};

//verify otp email
const verifyOTP=async(req,res)=>{
    const { otp,userId } = req.body;
    console.log("verify otp:",otp);
    console.log("verify userId:",userId);
    if(!userId || !otp){
        return res.json({ success: false, message: "Empty otp details are not allowed" });
    }
    try {
        const userOTPRecord = await UserOTPVerification.findOne({ userId });
        if (!userOTPRecord) {
            return res.json({ success: false, message: "No OTP found for this user" });
        }

        const isOTPMatch = await bcrypt.compare(otp, userOTPRecord.otp);
        if (!isOTPMatch || userOTPRecord.expiredAt < Date.now()) {
            await UserOTPVerification.deleteMany({ userId });
            return res.json({ success: false, message: "Invalid or expired OTP" });
        }
       
        // OTP is valid, mark the user as verified
        await userModel.updateOne({ _id: userId }, { isVerified: true });
        await UserOTPVerification.deleteMany({ userId }); // Delete OTP record

        // Issue token after successful verification
        const token = createToken(userId);
        res.json({ success: true, message: "User verified successfully", token });


    } catch (error) {
        res.json({ success: false, message: "Error in OTP verification" });
    }
}

const resendOTP = async (req, res) => {
    const { userId, email } = req.body;
    
    try {
        if (!userId || !email) {
            return res.json({ success: false, message: "User ID and email are required" });
        }

        // Ensure user exists
        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        // Delete any previous OTP records for the user
        await UserOTPVerification.deleteMany({ userId });

        // Resend OTP by calling sendOTPVerificationEmail function
        await sendOTPVerificationEmail({ _id: userId, email }, res);

    } catch (error) {
        console.error("Error in resending OTP:", error);
        res.json({ success: false, message: "Failed to resend OTP" });
    }
};

// Export functions
export { loginUser, registerUser, sendOTPVerificationEmail, verifyOTP, resendOTP };

