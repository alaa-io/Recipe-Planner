import * as React from "react";
import Image from "next/image";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { Recipe } from "@/app/search/page";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
interface RecipeCardProps {
  recipe: Recipe;
  isPlanned: boolean;
  onAdd: (recipeId: string) => void;
  onDelete?: (recipeId: string) => void;
}
import { gql, useMutation } from "@apollo/client";
import { useUserStore } from "@/store/zustand/userStore";
import { useCurrentDayStore } from "@/store/zustand/currentDayStore";
import { useSnackStore } from "@/store/zustand/snackbarStore";
import client from "@/utils/ApolloClient";
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

const DELETE_Planned_Recipe = gql`
  mutation DeletePlannedRecipe($userId: ID!, $recipeId: ID!) {
    deletePlannedRecipe(userId: $userId, recipeId: $recipeId) {
      id
    }
  }
`;

export default function RecipeCard({
  recipe,
  onAdd,
  isPlanned,
}: RecipeCardProps) {
  const { user, refetchUserPlannedRecipes, plannedRecipes } = useUserStore();
  const { qSnack } = useSnackStore();
  const { today } = useCurrentDayStore();

  const [add, { loading, error }] = useMutation(ADD_Planned_Recipe, {
    onError: (error) => {},
    onCompleted: (data) => {
      client.refetchQueries({
        include: ["GetUserPlannedRecipes"],
      });
    },
  });
  const values = {
    userId: user?.id,
    recipeId: recipe.id,
    date: new Date(today).getTime().toString(), // timestamps
  };

  const [deletePlannedRecipe, { loading: deleteLoading, error: deleteError }] =
    useMutation(DELETE_Planned_Recipe, {
      onError: (error) => {},
      onCompleted: (data) => {},
    });
  const deleteValues = {
    userId: user?.id,
    recipeId: recipe.id,
  };
  const deleteRecipeFromCurrentDay = (id: string) => {
    deletePlannedRecipe({ variables: deleteValues });
  };

  const addRecipeToCurrentDay = (id: string) => {
    add({ variables: values });
  };

  return (
    <Link
      href={"/recipes/" + `${recipe.id}`}
      style={{
        textDecoration: "none",
      }}
    >
      <Card
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
        }}
      >
        <Image
          alt="Random image"
          src={recipe.image}
          width={0}
          height={0}
          sizes="100vw"
          style={{ width: "120px", height: "auto", objectFit: "cover" }}
        />

        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h5" component="div"></Typography>
          <Typography gutterBottom variant="h5" component="div">
            {recipe.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {recipe.description}
          </Typography>
        </CardContent>
        {!isPlanned && (
          <Button
            disabled={loading}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // addRecipeToCurrentDay(recipe.id)
              onAdd(recipe.id);
              refetchUserPlannedRecipes();
              if (!error) {
                qSnack({
                  msg: "Recipe added to your day",
                  severity: "success",
                });
              }

              if (error)
                qSnack({
                  msg: "Recipe already added to your day",
                  severity: "warning",
                });
            }}
          >
            <AddIcon fontSize="large" />
          </Button>
        )}
        {isPlanned && (
          <Button
            disabled={deleteLoading}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              refetchUserPlannedRecipes();
              try {
                deleteRecipeFromCurrentDay(recipe.id);

                if (!deleteError) {
                  qSnack({
                    msg: "Recipe deleted from your day",
                    severity: "warning",
                  });
                }
              } catch (e) {
                if (deleteError)
                  qSnack({
                    msg: "Recipe already deleted from your day",
                    severity: "warning",
                  });
              }
            }}
          >
            <ClearIcon fontSize="large" color="warning" />
          </Button>
        )}
        <CardActions></CardActions>
      </Card>
    </Link>
  );
}
