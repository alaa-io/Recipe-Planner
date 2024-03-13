import { model, Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

interface PlannedRecipe {
  date: string;
  recipeId: string;
}

interface FavoriteRecipe {
  recipeId: string;
}

interface BlockedRecipe {
  recipeId: string;
}

export enum UserAllergy {
  DAIRY = "DAIRY",
  EGG = "EGG",
  GLUTEN = "GLUTEN",
  GRAIN = "GRAIN",
  PEANUT = "PEANUT",
  SEAFOOD = "SEAFOOD",
  SESAME = "SESAME",
  SHELLFISH = "SHELLFISH",
  SOY = "SOY",
  SULFITE = "SULFITE",
  TREE_NUT = "TREE_NUT",
  WHEAT = "WHEAT",
}

interface UserModel extends Document {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  plannedRecipes: PlannedRecipe[];
  favoriteRecipes: FavoriteRecipe[];
  blockedRecipes: BlockedRecipe[];
  allergies: UserAllergy[];
}

const userSchema = new Schema<UserModel>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  plannedRecipes: [{ date: String, recipeId: String }],
  favoriteRecipes: [{ recipeId: String }],
  blockedRecipes: [{ recipeId: String }],
  allergies: [{ type: String, enum: Object.values(UserAllergy) }],
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const UserModel = model<UserModel>("User", userSchema);

export default UserModel;
