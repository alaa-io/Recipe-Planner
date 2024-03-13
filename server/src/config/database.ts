import mongoose from "mongoose";
import Recipe from "../models/recipe.model.js";
import User from "../models/user.model.js";
import { recipes } from "./recipes.js";
export async function connectDB() {
  try {
    mongoose.connect(process.env.MONGODB_URL);

    const db = mongoose.connection;

    db.once("open", async function () {
      await User.deleteMany({});
      await Recipe.deleteMany({});
      await Recipe.insertMany(recipes);
    });
  } catch (error) {
    throw new Error("MongoDB Connection Error"); // Throw an error to prevent server startup
  }
}

export default connectDB;
