import foodModel from "../models/foodModel.js";

import fs from 'fs';

//add food item

const addFood=async(req,res)=>{
    let image_filename=req.file.filename;
    const food=new foodModel({
        name:req.body.name,
        description:req.body.description,
        price:req.body.price,
        category:req.body.category,
        image:image_filename,
    })
    try{
        await food.save();
        return res.json({success:true,message:"Food Added"});
    }catch(error){
        console.log(error);
        return res.json({success:false,message:"Error"});
    }
}

const listFood=async (req,res)=>{
    try{
        const foods=await foodModel.find({});
        // console.log(foods);
        return res.json({success:true,data:foods});
    }catch(error){
        console.log(error);
        return res.json({success:false,message:"error"});
    }
}

const listFoodByCategory = async (req, res) => {
    try {
        const { category } = req.query;
        const foods = await foodModel.find({ category }); // Uses category index
        return res.json({ success: true, data: foods });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Error" });
    }
}

const listFoodSorted = async (req, res) => {
    try {
        const { sort = "asc" } = req.query; // default ascending
        const foods = await foodModel.find().sort({ price: sort === "asc" ? 1 : -1 }); // Uses price index
        return res.json({ success: true, data: foods });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Error" });
    }
}

const searchFoodByName = async (req, res) => {
    try {
        const { keyword } = req.query;
        const foods = await foodModel.find({ name: { $regex: keyword, $options: 'i' } }); // Uses name index if exact match
        return res.json({ success: true, data: foods });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Error" });
    }
}

//remove food item

const removeFood=async(req,res)=>{
    try{
        const food=await foodModel.findById(req.body.id);
        fs.unlink(`uploads/${food.image}`,()=>{})

        await foodModel.findByIdAndDelete(req.body.id);
        return res.json({success:true,message:"Food removed"});
    }catch(error){
        console.log(error);
        return res.json({success:false,message:"Error"});
    }
}

export {addFood,listFood,removeFood,listFoodByCategory,listFoodSorted,searchFoodByName};
