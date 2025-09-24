import express from "express";
import {
  addFood,
  listFood,
  removeFood,
  listFoodByCategory,
  listFoodSorted,
  searchFoodByName,
} from "../controllers/foodController.js";

import multer from "multer";

const foodRouter = express.Router();

// Image Storage Engine
const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

// Routes

// Add new food item
foodRouter.post("/add", upload.single("image"), addFood);

// List all food items
foodRouter.get("/list", listFood);

// Remove food item
foodRouter.post("/remove", removeFood);

// List food by category (e.g., /api/food/category?category=Pizza)
foodRouter.get("/category", listFoodByCategory);

// List food sorted by price (e.g., /api/food/sorted?sort=asc or desc)
foodRouter.get("/sorted", listFoodSorted);

// Search food by name (e.g., /api/food/search?keyword=burger)
foodRouter.get("/search", searchFoodByName);

export default foodRouter;
