import { gql } from "graphql-tag";

const typeDefs = gql`
  type Ingredient {
    name: String!
    quantity: Float
    unit: String
  }

  type Time {
    label: String!
    time: Int!
    unit: String!
  }

  type Recipe {
    id: ID!
    name: String!
    description: String!
    image: String!
    ingredients: [Ingredient]!
    instructions: [String]!
    categories: [String]!
    servings: Int!
    time: [Time]!
    difficulty: Int!
  }

  type RecipeSuccess {
    isSuccess: Boolean
    message: String!
  }

  input IngredientInput {
    name: String!
    quantity: Float
    unit: String
  }

  input TimeInput {
    label: String!
    time: Int!
    unit: String!
  }

  input RecipeInput {
    id: String!
    name: String!
    description: String!
    image: String!
    ingredients: [IngredientInput]!
    instructions: [String]!
    categories: [String]!
    servings: Int!
    time: [TimeInput]!
    difficulty: Int!
  }

  type Query {
    recipe(recipeId: ID!): Recipe
    getRecipes(amount: Int): [Recipe]
    searchRecipes(searchTerm: String, amount: Int): [Recipe]
  }

  type Mutation {
    addRecipe(recipe: RecipeInput!): Recipe
    updateRecipe(recipeId: ID!, recipe: RecipeInput): RecipeSuccess
    deleteRecipe(recipeId: ID!): RecipeSuccess
  }
`;

export default typeDefs;
