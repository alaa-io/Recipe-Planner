import jwt from "jsonwebtoken";
import RecipeModel from "../models/recipe.model.js";
import UserModel from "../models/user.model.js";
export const userHelper = {
  isEmailAlreadyExist: async (email) => {
    const user = await UserModel.findOne({ email: email });
    return user ? true : false;
  },
};

export const RecipeHelper = {
  isRecipeExists: async (id) => {
    const user = await RecipeModel.findById(id);
    return user ? true : false;
  },
};

export const validateToken = async (token) => {
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET) as {
    userId: string;
  };
  const userId = decodedToken.userId;
  // retrieve the user from the database
  const user = await UserModel.findById(userId);
  return user;
};
