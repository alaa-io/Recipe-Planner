import { Button } from "@mui/material";
import * as React from "react";
import AddIcon from "@mui/icons-material/Add";
import { gql, useMutation } from "@apollo/client";
import { useUserStore } from "@/store/zustand/userStore";
import { useSnackStore } from "@/store/zustand/snackbarStore";
import { useCurrentDayStore } from "@/store/zustand/currentDayStore";

interface AddRecipeBtnProps {
  recipeId: string;
}

const ADD_Planned_Recipe = gql`
  mutation PlanRecipe($userId: ID!, $recipeId: ID!, $date: String!) {
    planRecipe(userId: $userId, recipeId: $recipeId, date: $date) {
      plannedRecipes {
        date
        recipeId
      }
    }
  }
`;
export const AddRecipeBtn = ({ recipeId }: AddRecipeBtnProps) => {
  const { user } = useUserStore();

  const { qSnack } = useSnackStore();
  const { today } = useCurrentDayStore();
  const [add, { loading, error }] = useMutation(ADD_Planned_Recipe, {
    onError: (error) => {},
    onCompleted: (data) => {},
  });
  const values = {
    userId: user?.id,
    recipeId: recipeId,
    date: today.getTime().toString(), // timestamps
  };
  const addRecipeToCurrentDay = (id: string) => {
    add({ variables: values });
  };
  return (
    <Button
      color="primary"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        addRecipeToCurrentDay(recipeId);
        qSnack({
          msg: "Recipe added to your plan for today",
          severity: "success",
        });
      }}
    >
      <AddIcon />
    </Button>
  );
};
