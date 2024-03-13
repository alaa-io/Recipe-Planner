"use client";
import * as React from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
  Divider,
  Grid,
  IconButton,
  InputBase,
  Paper,
  Skeleton,
  Stack,
} from "@mui/material";
import { useState, useCallback } from "react";
import { gql, useLazyQuery } from "@apollo/client";
import debounce from "lodash/debounce";
import Search from "@mui/icons-material/Search";
import RecipeCard from "@/components/RecipeCard";
import { format, isSameDay } from "date-fns";
import ScrollUp from "@/components/ScrollUp";
import { useCurrentDayStore } from "@/store/zustand/currentDayStore";
import { useUserStore } from "@/store/zustand/userStore";
import { useAuthModalStore } from "@/store/zustand/authModalStore";
import { redirect } from "next/navigation";
import { useMutation } from "@apollo/client";
const SEARCH_RECIPES = gql`
  query SearchRecipes($searchTerm: String, $amount: Int) {
    searchRecipes(searchTerm: $searchTerm, amount: $amount) {
      id
      name
      description
      image
    }
  }
`;
export interface Recipe {
  __typename: string;
  id: string;
  name: string;
  description: string;
  image: string;
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

export default function StarredPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchRecipes, { loading, data }] =
    useLazyQuery(SEARCH_RECIPES);
  const [list, setList] = useState(searchRecipes);
  const { user, plannedRecipes, refetchUserPlannedRecipes } = useUserStore();
  const { today } = useCurrentDayStore();

  const { modalState, setModalState } = useAuthModalStore();
  const [add, { loading: addLoading, error: addError }] = useMutation(
    ADD_Planned_Recipe,
    {
      onError: (error) => {},
      onCompleted: (data) => {},

      refetchQueries: ["GetUserPlannedRecipes"],
    }
  );

  const handleSubmit = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault;
    debouncedSearchRecipes(searchTerm);
    setSearchTerm("");
  };
  const debouncedSearchRecipes = useCallback(
    debounce((searchTerm) => {
      if (searchTerm === "") {
        return;
      }
      searchRecipes({ variables: { searchTerm, amount: 10 } });
    }, 100),
    []
  );

  React.useEffect(() => {}, [plannedRecipes]);

  const same = isSameDay(
    parseInt("1697030832550"),
    parseInt(new Date(today).getTime().toString())
  );

  if (!user) {
    setModalState({
      ...modalState,
      open: true,
      view: "login",
    });
    redirect("/");
  }

  if (loading)
    return (
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ marginTop: "1rem" }}
      >
        <Container
          maxWidth="sm"
          sx={{
            paddingTop: "0.3rem",
            paddingBottom: "0.3rem",
          }}
        >
          <Skeleton variant="rectangular" height={90} />
        </Container>
      </Grid>
    );

  const onAdd = (recipeId: string) => {
    const values = {
      userId: user?.id,
      recipeId: recipeId,
      date: new Date(today).getTime().toString(), // timestamps
    };

    add({ variables: values });

    refetchUserPlannedRecipes();
  };

  return (
    <Container>
      <ScrollUp />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper
          component="form"
          sx={{
            display: "flex",
            flexBasis: 1,
            alignItems: "center",
            width: "100%",
            maxWidth: "500px",
            height: "50px",
          }}
        >
          <InputBase
            onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
            fullWidth
            sx={{ ml: 3, flex: 1 }}
            placeholder="Search for recipes"
            inputProps={{ "aria-label": "Search for recipes" }}
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
          <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
          <IconButton
            type="button"
            onClick={(e) => handleSubmit(e)}
            disabled={loading}
            sx={{ p: "10px" }}
            aria-label="search"
          >
            <Search />
          </IconButton>
        </Paper>
        <Typography
          color={"black"}
          textTransform={"none"}
          sx={{ flexGrow: 1, pt: 1 }}
        >
          You are adding Recipes for this date:{" "}
          {format(new Date(today), "dd.MM.yyyy")}
        </Typography>
        {data && (
          <Stack direction={"column"} spacing={1} gap={1} pt={2}>
            {data.searchRecipes
              .filter((recipe: Recipe) => {
                return !plannedRecipes.some(
                  (plannedRecipe: any) =>
                    plannedRecipe.recipeId === recipe.id &&
                    isSameDay(
                      parseInt(plannedRecipe.date),
                      parseInt(new Date(today).getTime().toString())
                    )
                );
              })
              .map((recipe: Recipe) => {
                return (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    isPlanned={false}
                    onAdd={onAdd}
                  />
                );
              })}
          </Stack>
        )}

        {data && data.searchRecipes.length === 0 && <p>No recipes found.</p>}
      </Box>
    </Container>
  );
}
