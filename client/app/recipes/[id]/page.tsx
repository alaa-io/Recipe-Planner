"use client";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import ScrollUp from "@/components/ScrollUp";
import { Button, Card, CardMedia, Grid, Rating, Tooltip } from "@mui/material";
import { blue } from "@mui/material/colors";
import AddIcon from "@mui/icons-material/Add";
import { useSnackStore } from "@/store/zustand/snackbarStore";
import { useCurrentDayStore } from "@/store/zustand/currentDayStore";
import { useUserStore } from "@/store/zustand/userStore";
const GET_RECIPE_BY_ID = gql`
  query Recipe($recipeId: ID!) {
    recipe(recipeId: $recipeId) {
      id
      categories
      description
      difficulty
      image
      ingredients {
        name
        quantity
        unit
      }
      instructions
      name
      servings
      time {
        label
        time
        unit
      }
    }
  }
`;

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
function getRecipeById(id: string) {
  const { data, loading } = useQuery(GET_RECIPE_BY_ID, {
    variables: { recipeId: id },
  });

  if (loading) return <p>Loading...</p>;

  return data;
}

export default function Page({ params }: { params: { id: string } }) {
  const [add, { loading, error }] = useMutation(ADD_Planned_Recipe, {
    onError: (error) => {},
    onCompleted: (data) => {},
  });

  const data = getRecipeById(params.id);
  const { qSnack } = useSnackStore();
  const { today } = useCurrentDayStore();
  const { user } = useUserStore();
  const values = {
    userId: user?.id,
    recipeId: data.recipe ? data.recipe.id : "",
    date: new Date(today).getTime().toString(), // timestamps
  };
  function titleCase(str: string) {
    var splitStr = str.toLowerCase().split(" ");
    for (var i = 0; i < splitStr.length; i++) {
      splitStr[i] =
        splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }

    return splitStr.join(" ");
  }
  const handleClick = () => {
    if (!error && !loading) {
      qSnack({
        msg: "Recipe added to your day",
        severity: "success",
      });
      add({ variables: values });
    }
    if (error)
      qSnack({
        msg: "Recipe already added to your day",
        severity: "warning",
      });
  };

  if (!data.recipe) {
    return (
      <Box>
        <Typography variant="h6" gutterBottom textAlign={"center"}>
          Recipe not found
        </Typography>
      </Box>
    );
  }
  return (
    <Container>
      <ScrollUp />
      <Container
        maxWidth="sm"
        sx={{
          paddingTop: "0.3rem",
          paddingBottom: "0.3rem",
        }}
      >
        <Card
          sx={{
            borderRadius: "1rem",
          }}
        >
          <Grid container alignItems="center" justifyContent="center">
            <Grid item xs={10}>
              <CardMedia
                component={"img"}
                src={data.recipe ? data.recipe.image : "no image"}
                sx={{
                  marginTop: "2rem",
                  marginBottom: "1rem",
                  height: "20rem",
                  width: "100%",
                  objectFit: "cover",
                  borderRadius: "1rem",
                  objectPosition: "center",
                }}
              />
              <Grid
                sx={{
                  display: "flex",
                }}
              >
                <Grid
                  container
                  direction="column"
                  style={{
                    overflowWrap: "break-word",
                    wordWrap: "break-word",
                    hyphens: "auto",
                  }}
                >
                  <Typography variant="h5">
                    <span
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: "vertical",
                        fontWeight: "bold",
                      }}
                    >
                      {data.recipe.name}
                    </span>
                  </Typography>
                  <Typography
                    variant="body1"
                    pt={2}
                  >
                    Categories:{" "}
                    {data.recipe.categories
                      ? data.recipe.categories.map((name: string) => {
                          return (
                            <span
                              style={{
                                margin: "0.2rem",
                                backgroundColor: blue[500],
                                color: "#fff",
                                padding: "5px",
                                borderRadius: "0.5rem",
                                marginTop: "0.5rem",
                                width: "fit-content",
                              }}
                              key={name}
                            >
                              {titleCase(name)}
                            </span>
                          );
                        })
                      : "N/A"}
                  </Typography>
                  <Typography variant="body1">
                    Servings: {data.recipe.servings}
                  </Typography>
                  <Typography variant="body1">
                    Time:{" "}
                    {data.recipe.time.length !== 0
                      ? data.recipe.time
                          .map((time: any) => {
                            return `${time.label} ${time.time}${time.unit}`;
                          })
                          .join(", ")
                      : "N/A"}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    Difficulty:
                    {data.recipe.difficulty ? (
                      <Rating
                        name="read-only"
                        value={
                          data.recipe.difficulty ? data.recipe.difficulty : 0
                        }
                        readOnly
                        size="large"
                        sx={{
                          marginLeft: "0.5rem",
                          alignSelf: "center",
                        }}
                      />
                    ) : (
                      <></>
                    )}
                  </Typography>
                </Grid>

                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => {
                    handleClick();
                  }}
                  sx={{
                    background: blue[500],
                    borderRadius: "0.5rem",
                    padding: "0.5rem",
                    marginTop: "6rem",
                    marginLeft: "auto",
                  }}
                >
                  <Tooltip title={"Add recipe to " + new Date().toDateString()}>
                    <AddIcon fontSize="large" />
                  </Tooltip>
                </Button>
              </Grid>

              <Grid>
                <Typography variant="h5" fontWeight={"bold"}>
                  Description:
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: "1.1rem",
                  }}
                >
                  {data.recipe.description}
                </Typography>
                <Typography variant="h5" fontWeight={"bold"}>
                  Ingredients:
                </Typography>
                <ul
                  style={{
                    fontSize: "1.1rem",
                  }}
                >
                  {data.recipe.ingredients
                    ? data.recipe.ingredients.map((ingredient: any) => {
                        return (
                          <li>
                            {ingredient.quantity} {ingredient.unit}{" "}
                            {ingredient.name}
                          </li>
                        );
                      })
                    : "N/A"}
                </ul>
                <Typography
                  variant="h5"
                  fontWeight={"bold"}
                >
                  Instructions:
                </Typography>
                <ol
                  style={{
                    fontSize: "1.1rem",
                  }}
                >
                  {data.recipe.instructions
                    ? data.recipe.instructions.map((instruction: any) => {
                        return <li key={instruction}>{instruction}</li>;
                      })
                    : "N/A"}
                </ol>
              </Grid>
            </Grid>
          </Grid>
        </Card>
      </Container>
    </Container>
  );
}
