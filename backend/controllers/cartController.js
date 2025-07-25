import userModel from "../models/userModel.js";

// add items to user cart
const addToCart=async(req,res)=>{
    try{
        let userData=await userModel.findById(req.body.userId);
        let cartData=await userData.cartData;
        // the above line will give us the cartdata object, then below we will modify the cartData object and the finally update the userModel 

        if(!cartData[req.body.itemId]){
            cartData[req.body.itemId]=1;
        }
        else{
            cartData[req.body.itemId]+=1;
        }

        await userModel.findByIdAndUpdate(req.body.userId,{cartData});
        return res.json({success:true,message:"Added to Cart"});
    }catch(error){
        console.log(error);
        return res.json({success:false,message:"Error"});
    }
}

//remove items from user cart

const removeFromCart=async(req,res)=>{
    try {
        let userData=await userModel.findById(req.body.userId);
        let cartData=await userData.cartData;

        if(cartData[req.body.itemId] > 0){
            cartData[req.body.itemId]-=1;
        }

        await userModel.findByIdAndUpdate(req.body.userId,{cartData});
        return res.json({success:true,message:"Removed from Cart"});
    } catch (error) {
        console.log(error);
        return res.json({success:false,message:"Error"});
    }
}


//fetch user cart data
const getCart=async(req,res)=>{
    try {
        let userData=await userModel.findById(req.body.userId);
        let cartData=await userData.cartData;
        return res.json({success:true,cartData});

    } catch (error) {
        console.log(error);
        return res.json({success:false,message:"Error"});
    }
}

export {addToCart,removeFromCart,getCart};