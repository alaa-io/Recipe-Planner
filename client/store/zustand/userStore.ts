import jwtDecode from "jwt-decode";
import { create, StateCreator } from "zustand";
import { createJSONStorage, persist, PersistOptions } from "zustand/middleware";
import { gql } from "@apollo/client";
import client from "@/utils/ApolloClient";

type plannedRecipes = {
  date: string;
  recipeId: string;
};

export type User = {
  id: string;
  email: string;
  name: string;
  token: string;
};

type UserStore = {
  user: User | null;
  plannedRecipes: plannedRecipes[];
  setUser: (user: User) => void;
  refetchUserPlannedRecipes: () => void;
  logout: () => void;
  getUserFromLocalStorageToken: () => Promise<User | null>;
  getCurrentUser: () => Promise<void>;
};

type MyPersist = (
  config: StateCreator<UserStore>,
  options: PersistOptions<UserStore>
) => StateCreator<UserStore>;

const GET_USER_QUERY = gql`
  query GetUser($userId: ID!, $token: String!) {
    getUser(userId: $userId, token: $token) {
      user {
        id
        name
        email
        plannedRecipes {
          date
          recipeId
        }
      }
    }
  }
`;

const GET_PLANNED_RECIPES_QUERY = gql`
  query GetUserPlannedRecipesIDs($userId: ID!) {
    getUserPlannedRecipesIDs(userId: $userId) {
      date
      recipeId
    }
  }
`;

export const useUserStore = create<UserStore, []>(
  (persist as MyPersist)(
    (set, get): UserStore => ({
      user:
        localStorage.getItem("token") ?
          jwtDecode(localStorage.getItem("token") as string)
        : null,
      setUser: (user: User) => {
        set({ user });
      },
      plannedRecipes: [] as plannedRecipes[],

      refetchUserPlannedRecipes: async () => {
        const { data } = await client.query({
          query: GET_PLANNED_RECIPES_QUERY,
          variables: {
            userId: get().user?.id,
          },
          context: {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },

          fetchPolicy: "network-only",
        });

        set({ plannedRecipes: data.getUserPlannedRecipesIDs });
      },

      logout: () => {
        set({ user: null });
        localStorage.removeItem("token");
      },
      getUserFromLocalStorageToken: async () => {
        const token = localStorage.getItem("token");
        if (token) {
          // Make GraphQL query to retrieve user from token
          const { data } = await client.query({
            query: GET_USER_QUERY,
            context: {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          });
          return data.user;
        } else {
          return null;
        }
      },
      getCurrentUser: async () => {
        const user = await get().getUserFromLocalStorageToken();

        if (user) {
          set({ user });
        } else {
          set({ user: null });
        }
      },
    }),
    {
      name: "user-storage",

      storage: createJSONStorage(() => localStorage),
    }
  )
);
