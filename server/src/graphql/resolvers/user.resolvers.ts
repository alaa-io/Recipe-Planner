import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { IResolvers } from "@graphql-tools/utils";
import Recipe from "../../models/recipe.model.js";
import User, { UserAllergy } from "../../models/user.model.js";
import { userHelper } from "../../utils/helpers.js";
const isValidObjectId = mongoose.Types.ObjectId.isValid;
import throwCustomError, { ErrorTypes } from "../../utils/error-handler.js";
import { isSameDay, parse, format } from "date-fns";

const userResolvers: IResolvers = {
  Query: {
    getUserPlannedRecipes: async (_, { userId, date }) => {
      // Find the user with the given ID
      const user = await User.findById(userId).populate("plannedRecipes");

      // If the user doesn't exist, throw an error
      if (!user) {
        throw new Error("User not found");
      }

      // Filter the user's planned recipes by the given date
      const plannedRecipes = user.plannedRecipes.filter((plannedRecipe) =>
        isSameDay(parseInt(plannedRecipe.date), parseInt(date))
      );

      // match the recipeId to the recipe in the Recipe collection
      const recipes = await Recipe.find({
        _id: {
          $in: plannedRecipes.map((plannedRecipe) => plannedRecipe.recipeId),
        },
      });

      // Return the recipes to the client
      return recipes;
    },

    getUserPlannedRecipesIDs: async (_, { userId }) => {
      // Find the user with the given ID
      const user = await User.findById(userId).populate("plannedRecipes");

      // If the user doesn't exist, throw an error
      if (!user) {
        throw new Error("User not found");
      }
       
      // Return the planned recipes IDs to the client
      return user.plannedRecipes;
    },

    getUserPlannedRecipesIngredientsListByDateRange: async (
      _,
      { userId, startDate, endDate }
    ) => {
      // Find the user with the given ID
      const user = await User.findById(userId).populate("plannedRecipes");

      // If the user doesn't exist, throw an error
      if (!user) {
        throw new Error("User not found");
      }

      // Filter the user's planned recipes by the given date range

      const plannedRecipes = user.plannedRecipes.filter((plannedRecipe) => {
        const plannedRecipeDate = parse(plannedRecipe.date, "t", new Date());
        return (
          plannedRecipeDate >= parse(startDate, "t", new Date()) &&
          plannedRecipeDate <= parse(endDate, "t", new Date())
        );
      });

      const recipes = await Recipe.find({
        _id: {
          $in: plannedRecipes.map((plannedRecipe) => plannedRecipe.recipeId),
        },
      });

      // Return the recipes to the client
      const ingredients = recipes.map((recipe) => recipe.ingredients);
      return ingredients.flat();
    },
  },

  Mutation: {
    signUp: async (_, { name, email, password }) => {
      if (!name || !email || !password)
        throwCustomError(
          "Please enter required fields.",
          ErrorTypes.BAD_USER_INPUT
        );
      const isUserExists = await userHelper.isEmailAlreadyExist(email);
      if (isUserExists)
        throwCustomError(
          "Email is already Registered",
          ErrorTypes.ALREADY_EXISTS
        );
      else {
        const user = await User.create({
          name,
          email,
          password,
        });

        const token = jwt.sign(
          { userId: user.id, name: user.name, email: user.email },
          process.env.JWT_SECRET,
          {
            expiresIn: 3600,
          }
        );

        return {
          user,
          token,
        };
      }
    },

    login: async (_, { email, password }, context) => {
      if (!email || !password)
        throwCustomError(
          "Please enter required fields.",
          ErrorTypes.BAD_USER_INPUT
        );
      const user = await User.findOne({ email });
      if (!user)
        throwCustomError("Invalid credentials.", ErrorTypes.BAD_USER_INPUT);
      else {
        const passwordMatch = await bcrypt.compareSync(password, user.password);
        if (!passwordMatch)
          throwCustomError("Invalid credentials.", ErrorTypes.BAD_USER_INPUT);
        else {
          const token = jwt.sign(
            { userId: user.id, name: user.name, email: user.email },
            process.env.JWT_SECRET
          );
           
          return {
            user,
            token,
          };
        }
      }
    },

    planRecipe: async (_, { userId, recipeId, date }, context) => {
      if (!date)
        throwCustomError("Date is missing.", ErrorTypes.BAD_USER_INPUT);
      else if (!isValidObjectId(userId))
        throwCustomError(
          "Invalid user id. Must be a valid ObjectId.",
          ErrorTypes.BAD_USER_INPUT
        );
      else if (!isValidObjectId(recipeId))
        throwCustomError(
          "Invalid recipe id. Must be a valid ObjectId.",
          ErrorTypes.BAD_USER_INPUT
        );
      else {
        const user = await User.findById(userId);
        if (!user) throwCustomError("User not found.", ErrorTypes.NOT_FOUND);
        else {
          const plannedRecipeExists = user.plannedRecipes.some(
            (plannedRecipe) =>
              plannedRecipe.recipeId === recipeId && plannedRecipe.date === date
          );
          // If the planned recipe does not exist, add it to the user's plannedRecipes array
          if (!plannedRecipeExists) {
            user.plannedRecipes.push({
              recipeId,
              date,
            });
            // Save the user changes
            await user.save();
            return user;
          } else
            throwCustomError(
              "Planned recipe already exist.",
              ErrorTypes.ALREADY_EXISTS
            );
        }
      }
    },

    deletePlannedRecipe: async (_, { userId, recipeId }, { token }) => {
      if (!isValidObjectId(userId))
        throwCustomError(
          "Invalid user ID. Must be a valid ObjectId.",
          ErrorTypes.BAD_USER_INPUT
        );
      else if (!isValidObjectId(recipeId))
        throwCustomError(
          "Invalid recipe ID. Must be a valid ObjectId.",
          ErrorTypes.BAD_USER_INPUT
        );
      else {
        const user = await User.findById(userId);
        if (user) {
          // Get the planned recipe index
          const plannedRecipeIndex = user.plannedRecipes.findIndex(
            (plannedRecipe) => plannedRecipe.recipeId === recipeId
          );
          // If the planned recipe exists, remove it from the array
          if (plannedRecipeIndex !== -1) {
            user.plannedRecipes.splice(plannedRecipeIndex, 1);
            // Save the user changes
            await user.save();
            return user;
          } else
            throwCustomError("Planned recipe not found.", ErrorTypes.NOT_FOUND);
        } else {
          throwCustomError("User not found", ErrorTypes.BAD_USER_INPUT);
        }
      }
    },

    addFavoriteRecipe: async (_, { userId, recipeId }, context) => {
      if (!isValidObjectId(userId))
        throwCustomError(
          "Invalid user id. Must be a valid ObjectId.",
          ErrorTypes.BAD_USER_INPUT
        );
      else if (!isValidObjectId(recipeId))
        throwCustomError(
          "Invalid recipe id. Must be a valid ObjectId.",
          ErrorTypes.BAD_USER_INPUT
        );
      else {
        const user = await User.findById(userId);
        if (!user) throwCustomError("User not found.", ErrorTypes.NOT_FOUND);
        else {
          const favoriteRecipeExists = user.favoriteRecipes.some(
            (favoriteRecipes) => favoriteRecipes.recipeId === recipeId
          );
          // If the favorite recipe does not exist, add it to the user's favoriteRecipes array
          if (!favoriteRecipeExists) {
            user.favoriteRecipes.push({
              recipeId,
            });
            // Save the user changes
            await user.save();
            return user;
          } else
            throwCustomError(
              "Favorite recipe already exist.",
              ErrorTypes.ALREADY_EXISTS
            );
        }
      }
    },

    deleteFavoriteRecipe: async (_, { userId, recipeId }, { token }) => {
      if (!isValidObjectId(userId))
        throwCustomError(
          "Invalid user ID. Must be a valid ObjectId.",
          ErrorTypes.BAD_USER_INPUT
        );
      else if (!isValidObjectId(recipeId))
        throwCustomError(
          "Invalid recipe ID. Must be a valid ObjectId.",
          ErrorTypes.BAD_USER_INPUT
        );
      else {
        const user = await User.findById(userId);
        if (user) {
          // Get the favorite recipe index
          const favoriteRecipeIndex = user.favoriteRecipes.findIndex(
            (favoriteRecipe) => favoriteRecipe.recipeId === recipeId
          );
          // If the favorite recipe exists, remove it from the array
          if (favoriteRecipeIndex !== -1) {
            user.favoriteRecipes.splice(favoriteRecipeIndex, 1);
            // Save the user changes
            await user.save();
            return user;
          } else
            throwCustomError(
              "Favorite recipe not found.",
              ErrorTypes.NOT_FOUND
            );
        } else {
          throwCustomError("User not found", ErrorTypes.BAD_USER_INPUT);
        }
      }
    },

    blockRecipe: async (_, { userId, recipeId }, context) => {
      if (!isValidObjectId(userId))
        throwCustomError(
          "Invalid user id. Must be a valid ObjectId.",
          ErrorTypes.BAD_USER_INPUT
        );
      else if (!isValidObjectId(recipeId))
        throwCustomError(
          "Invalid recipe id. Must be a valid ObjectId.",
          ErrorTypes.BAD_USER_INPUT
        );
      else {
        const user = await User.findById(userId);
        if (!user) throwCustomError("User not found.", ErrorTypes.NOT_FOUND);
        else {
          const blockedRecipeExists = user.blockedRecipes.some(
            (blockedRecipe) => blockedRecipe.recipeId === recipeId
          );
          // If the block recipe does not exist, add it to the user's blockRecipes array
          if (!blockedRecipeExists) {
            user.blockedRecipes.push({
              recipeId,
            });
            // Save the user changes
            await user.save();
            return user;
          } else
            throwCustomError(
              "Blocked recipe already exist.",
              ErrorTypes.ALREADY_EXISTS
            );
        }
      }
    },

    deleteBlockedRecipe: async (_, { userId, recipeId }, { token }) => {
      if (!isValidObjectId(userId))
        throwCustomError(
          "Invalid user ID. Must be a valid ObjectId.",
          ErrorTypes.BAD_USER_INPUT
        );
      else if (!isValidObjectId(recipeId))
        throwCustomError(
          "Invalid recipe ID. Must be a valid ObjectId.",
          ErrorTypes.BAD_USER_INPUT
        );
      else {
        const user = await User.findById(userId);
        if (user) {
          // Get the blocked recipe index
          const blockedRecipeIndex = user.blockedRecipes.findIndex(
            (blockedRecipe) => blockedRecipe.recipeId === recipeId
          );
          // If the blocked recipe exists, remove it from the array
          if (blockedRecipeIndex !== -1) {
            user.blockedRecipes.splice(blockedRecipeIndex, 1);
            // Save the user changes
            await user.save();
            return user;
          } else
            throwCustomError("Blocked recipe not found.", ErrorTypes.NOT_FOUND);
        } else {
          throwCustomError("User not found", ErrorTypes.BAD_USER_INPUT);
        }
      }
    },

    addAllergy: async (_, { userId, allergy }, context) => {
      if (!isValidObjectId(userId))
        throwCustomError(
          "Invalid user id. Must be a valid ObjectId.",
          ErrorTypes.BAD_USER_INPUT
        );
      else if (!allergy || !Object.values(UserAllergy).includes(allergy))
        throwCustomError(
          "Invalid or missing allergy.",
          ErrorTypes.BAD_USER_INPUT
        );
      else {
        const user = await User.findById(userId);
        if (!user) throwCustomError("User not found.", ErrorTypes.NOT_FOUND);
        else {
          // Check if the allergy already exists in the user's allergies array
          if (user.allergies.includes(allergy)) {
            throwCustomError(
              "Allergy already exists for this user.",
              ErrorTypes.BAD_USER_INPUT
            );
          } else {
            // Add the allergy to the user's allergies array.
            user.allergies.push(allergy);
            await user.save();
            return user;
          }
        }
      }
    },

    deleteAllergy: async (_, { userId, allergy }, { token }) => {
      if (!isValidObjectId(userId))
        throwCustomError(
          "Invalid user id. Must be a valid ObjectId.",
          ErrorTypes.BAD_USER_INPUT
        );
      else if (!allergy || !Object.values(UserAllergy).includes(allergy))
        throwCustomError(
          "Invalid or missing allergy.",
          ErrorTypes.BAD_USER_INPUT
        );
      else {
        const user = await User.findById(userId);
        if (!user) throwCustomError("User not found.", ErrorTypes.NOT_FOUND);
        else {
          // Check if the allergy already exists in the user's allergies array.
          const allergyIndex = user.allergies.findIndex(
            (userAllergy) => userAllergy === allergy
          );
          if (allergyIndex !== -1) {
            // Allergy exists, so remove it from the array.
            user.allergies.splice(allergyIndex, 1);
            await user.save();
            return user;
          } else
            throwCustomError(
              "Allergy not found in the user's allergies.",
              ErrorTypes.BAD_USER_INPUT
            );
        }
      }
    },
  },
};

export default userResolvers;
