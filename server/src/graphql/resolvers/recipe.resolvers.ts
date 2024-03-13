import { IResolvers } from "@graphql-tools/utils";
import Recipe from "../../models/recipe.model.js";
import mongoose from "mongoose";
const isValidObjectId = mongoose.Types.ObjectId.isValid;
import throwCustomError, { ErrorTypes } from "../../utils/error-handler.js";

const recipeResolvers: IResolvers = {
  Query: {
    recipe: async (_, { recipeId }) => {
      try {
        if (!isValidObjectId(recipeId))
          throwCustomError(
            "Invalid recipe ID. Must be a valid ObjectId.",
            ErrorTypes.BAD_USER_INPUT
          );
        const recipe = await Recipe.findById(recipeId);
        if (!recipe)
          throwCustomError("Recipe not found.", ErrorTypes.NOT_FOUND);
        return recipe;
      } catch (err) {
        throwCustomError(err.message, ErrorTypes.INTERNAL_SERVER_ERROR);
      }
    },

    getRecipes: async (_, { amount }) => {
      try {
        const recipes = await Recipe.find().limit(amount);
        return recipes;
      } catch (err) {
        throwCustomError(err.message, ErrorTypes.INTERNAL_SERVER_ERROR);
      }
    },

    searchRecipes: async (_, { searchTerm, amount }) => {
      try {
        const recipes = await Recipe.find({
          $or: [
            { name: { $regex: searchTerm, $options: "i" } },
            {
              "ingredients.name": {
                $regex: searchTerm,
                $options: "i",
              },
            },
            { description: { $regex: searchTerm, $options: "i" } },
            { category: { $regex: searchTerm, $options: "i" } },
          ],
        }).limit(amount);
        if (!recipes)
          throwCustomError("No recipes found.", ErrorTypes.NOT_FOUND);
        return recipes;
      } catch (err) {
        throwCustomError(err.message, ErrorTypes.INTERNAL_SERVER_ERROR);
      }
    },
  },

  Mutation: {
    addRecipe: async (_, { recipe }) => {
      try {
        const isRecipeExist = await Recipe.findOne({
          name: recipe.name,
        });
        if (isRecipeExist)
          throwCustomError(
            "Recipe with the same name already exists.",
            ErrorTypes.ALREADY_EXISTS
          );
        else {
          return await Recipe.create(recipe);
        }
      } catch (err) {
        throwCustomError(err.message, ErrorTypes.INTERNAL_SERVER_ERROR);
      }
    },

    updateRecipe: async (_, { recipeId, recipe }) => {
      try {
        if (!isValidObjectId(recipeId))
          throwCustomError(
            "Invalid recipe ID. Must be a valid ObjectId.",
            ErrorTypes.BAD_USER_INPUT
          );

        const isRecipe = await Recipe.findById(recipeId);
        if (!isRecipe)
          throwCustomError("Recipe not found", ErrorTypes.BAD_USER_INPUT);
        else {
          await Recipe.updateOne({ _id: recipeId }, recipe);

          return {
            isSuccess: true,
            message: "Recipe updated successfully",
          };
        }
      } catch (err) {
        throwCustomError(err.message, ErrorTypes.INTERNAL_SERVER_ERROR);
      }
    },

    deleteRecipe: async (_, { recipeId }) => {
      try {
        if (!isValidObjectId(recipeId))
          throwCustomError(
            "Invalid recipe ID. Must be a valid ObjectId.",
            ErrorTypes.BAD_USER_INPUT
          );
        const isRecipe = await Recipe.findById(recipeId);
        if (isRecipe) {
          await Recipe.deleteOne({ _id: recipeId });
          return {
            isSuccess: true,
            message: "Recipe deleted successfully",
          };
        } else {
          throwCustomError("Recipe not found", ErrorTypes.BAD_USER_INPUT);
        }
      } catch (err) {
        throwCustomError(err.message, ErrorTypes.INTERNAL_SERVER_ERROR);
      }
    },
  },
};

export default recipeResolvers;
