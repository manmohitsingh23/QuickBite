import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true  // Add index to improve search by name
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    index: true  // Useful for sorting/filtering by price
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    index: true  // Improve category-based filtering
  },
});

const foodModel=mongoose.models.food || mongoose.model("food",foodSchema);

export default foodModel;
