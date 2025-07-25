import mongoose from "mongoose";

export const connectDB=async()=>{
    await mongoose.connect(MONGODB_URI)
    .then(()=>{
        console.log('DB connected');
    })
}
