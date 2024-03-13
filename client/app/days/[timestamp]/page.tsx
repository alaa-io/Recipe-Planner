"use client";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { Button, Stack } from "@mui/material";
import { gql, useQuery } from "@apollo/client";
import { format } from "date-fns";
import { Recipe } from "@/app/search/page";
import RecipeCard from "@/components/RecipeCard";
import { useUserStore } from "@/store/zustand/userStore";
import ScrollUp from "@/components/ScrollUp";
import { redirect } from "next/navigation";
import { useAuthModalStore } from "@/store/zustand/authModalStore";
import Link from "next/link";
const GET_RECIPE_BY_ID = gql`
  query GetUserPlannedRecipes($userId: ID!, $date: String!) {
    getUserPlannedRecipes(userId: $userId, date: $date) {
      image
      id
      name
      description
    }
  }
`;

export default function Page({ params }: { params: { timestamp: string } }) {
  const { user } = useUserStore();
  const { data, loading, error } = useQuery(GET_RECIPE_BY_ID, {
    onCompleted: (data) => {},
    onError: (error) => {},
    variables: { date: params.timestamp, userId: user?.id },
  });
  if (
    data &&
    data.getUserPlannedRecipes !== undefined &&
    data.getUserPlannedRecipes.length === 0
  ) {
    return (
      <Stack
        direction={"column"}
        alignItems="center"
        spacing={1}
        gap={1}
        pt={2}
      >
        <Typography variant="h6" gutterBottom textAlign={"center"}>
          No planned recipes for this day{" "}
          {format(parseInt(params.timestamp), "dd.MM.yyyy")}
        </Typography>
        <Link href="/search">
          <Button variant="outlined" component="div">
            <Typography color={"black"} component="div" sx={{ flexGrow: 1 }}>
              Add Recipe
            </Typography>
          </Button>
        </Link>
      </Stack>
    );
  }

  const { modalState, setModalState } = useAuthModalStore();
  if (!user) {
    setModalState({
      ...modalState,
      open: true,
      view: "login",
    });
    redirect("/");
  }

  const onAdd = (recipeId: string) => {};
  return (
    <Container>
      <ScrollUp />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "left",
        }}
      >
        <Typography variant="h6" gutterBottom textAlign={"center"}>
          Planned Recipes for Today
        </Typography>
        {data && data.getUserPlannedRecipes && (
          <Stack direction={"column"} spacing={1} gap={1} pt={2}>
            {data.getUserPlannedRecipes.map((recipe: Recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                isPlanned
                onAdd={onAdd}
              />
            ))}
          </Stack>
        )}
      </Box>
    </Container>
  );
}
