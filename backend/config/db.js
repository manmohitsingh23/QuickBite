import mongoose from "mongoose";

export const connectDB=async()=>{
    await mongoose.connect('mongodb+srv://manmohitsingh104:fooddelproject2024@food-del.lek2j.mongodb.net/Food-Del')
    .then(()=>{
        console.log('DB connected');
    })
}