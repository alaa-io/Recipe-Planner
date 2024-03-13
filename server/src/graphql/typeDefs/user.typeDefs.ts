import { gql } from "graphql-tag";

const userTypeDefs = gql`
  input SignupInput {
    email: String!
    password: String!
    fname: String!
    lname: String
  }

  input LoginInput {
    email: String!
    password: String!
  }

  # Type Definitions
  scalar DateTime
  type PlannedRecipe {
    date: String!
    recipeId: String!
  }

  type FavoriteRecipe {
    recipe: Recipe
    user: User
  }

  type BlockedRecipe {
    recipe: Recipe
    user: User
  }

  type JwtToken {
    token: String!
  }

  type User {
    # User basic info
    id: ID!
    name: String!
    email: String!
    password: String!
    createdAt: DateTime
    updatedAt: DateTime
    # User recipes & preferences
    plannedRecipes: [PlannedRecipe]
    favoriteRecipes: [FavoriteRecipe]
    blockedRecipes: [BlockedRecipe]
    allergies: [String]
  }

  type UserWithToken {
    user: User!
    token: String!
  }

  type Query {
    getUserPlannedRecipes(userId: ID!, date: String!): [Recipe]
    getUserPlannedRecipesIDs(userId: ID!): [PlannedRecipe]
    getUserPlannedRecipesIngredientsListByDateRange(
      userId: ID!
      startDate: String!
      endDate: String!
    ): [Ingredient]
    getUserFavoriteRecipes(userId: ID!): [Recipe]
    getUserBlockedRecipes(userId: ID!): [Recipe]
    getUserAllergies(userId: ID!): [String]
  }

  type Mutation {
    # User Mutations
    signUp(name: String!, email: String!, password: String!): UserWithToken
    login(email: String!, password: String!): UserWithToken
    planRecipe(userId: ID!, recipeId: ID!, date: String!): User
    deletePlannedRecipe(userId: ID!, recipeId: ID!): User
    addFavoriteRecipe(userId: ID!, recipeId: ID!): User
    deleteFavoriteRecipe(userId: ID!, recipeId: ID!): User
    blockRecipe(userId: ID!, recipeId: ID!): User
    deleteBlockedRecipe(userId: ID!, recipeId: ID!): User
    addAllergy(userId: ID!, allergy: String!): User
    deleteAllergy(userId: ID!, allergy: String!): User
  }
`;

export default userTypeDefs;
