import { model, Schema, Document } from "mongoose";
interface Ingredient {
  name: string;
  quantity: number | null;
  unit: string | null;
}
interface Time {
  label: string;
  time: number;
  unit: string;
}

interface RecipeModel extends Document {
  name: string;
  description: string;
  image: string;
  ingredients: Ingredient[];
  instructions: string[];
  categories: string[];
  servings: number;
  time: Time[];
  difficulty: number;
}
const ingredientSchema = new Schema({
  name: { type: String, required: true },
  quantity: { type: Number },
  unit: { type: String },
});

const timeSchema = new Schema({
  label: { type: String, required: true },
  time: { type: Number, required: true },
  unit: { type: String, required: true },
});

const recipeSchema = new Schema<RecipeModel>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  ingredients: { type: [ingredientSchema], required: true },
  instructions: { type: [String], required: true },
  categories: { type: [String], required: true },
  servings: { type: Number, required: true },
  time: { type: [timeSchema], required: true },
  difficulty: { type: Number, required: true },
});

recipeSchema.index({ "$**": "text" });

const RecipeModel = model<RecipeModel>("Recipe", recipeSchema);

export default RecipeModel;
