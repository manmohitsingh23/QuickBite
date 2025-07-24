import mongoose from 'mongoose';

const UserOTPVerificationSchema=new mongoose.Schema({
    userId:{
        type:String,
        required:true,
    },
    otp:{
        type:String,
        required:true,
    },
    createdAt:Date,
    expiredAt:Date,
});

const UserOTPVerification=mongoose.model("UserOTPVerification",UserOTPVerificationSchema);

export default UserOTPVerification;

