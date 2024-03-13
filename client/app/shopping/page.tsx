"use client";
import * as React from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import DatePicker, { DateObject } from "react-multi-date-picker";
import ScrollUp from "@/components/ScrollUp";
import { useUserStore } from "@/store/zustand/userStore";
import { redirect } from "next/navigation";
import gql from "graphql-tag";
import { useAuthModalStore } from "@/store/zustand/authModalStore";
import { useQuery } from "@apollo/client";
import IngredientsChecklist, {
  Ingredient,
} from "@/components/IngredientsChecklist";

const GET_PLANNED_RECIPES_BY_DATE_RANGE = gql`
  query GetUserPlannedRecipesIngredientsListByDateRange(
    $userId: ID!
    $startDate: String!
    $endDate: String!
  ) {
    getUserPlannedRecipesIngredientsListByDateRange(
      userId: $userId
      startDate: $startDate
      endDate: $endDate
    ) {
      name
      quantity
      unit
    }
  }
`;
export default function Shopping() {
  const { user } = useUserStore();
  const [dates, setDates] = React.useState();
  const [startDate, setStartDate] = React.useState<DateObject | null>(null);
  const [endDate, setEndDate] = React.useState<DateObject | null>(null);
  const [ingredients, setIngredients] = React.useState<Ingredient[]>([]);
  const onInputChangeHandler = (value: DateObject | DateObject[] | null) => {
    if (Array.isArray(value)) {
      setStartDate(value[0]);
      setEndDate(value[1]);
    } else {
      setStartDate(value);
      setEndDate(value);
    }
  };

  const groupedIngredients = ingredients?.reduce((acc, curr) => {
    const existingIngredient = acc.find(
      (ingredient) => ingredient.name === curr.name
    );
    if (existingIngredient) {
      if (
        existingIngredient.unit === curr.unit &&
        existingIngredient.quantity !== null &&
        curr.quantity !== null
      ) {
        existingIngredient.quantity =
          parseInt(existingIngredient.quantity as string) +
          parseInt(curr.quantity as string);
      } else {
        return [...acc, curr];
      }
    } else {
      return [...acc, curr];
    }
    return acc;
  }, [] as Ingredient[]);

  const ingredientsAll = groupedIngredients?.map((ingredient): Ingredient => {
    return {
      name: ingredient.name,
      quantity: ingredient.quantity,
      unit: ingredient.unit,
    } as Ingredient;
  }) as Ingredient[];
  const { data, loading, error } = useQuery(GET_PLANNED_RECIPES_BY_DATE_RANGE, {
    skip: !startDate || !endDate,
    onCompleted: (data) => {
      setIngredients(
        data.getUserPlannedRecipesIngredientsListByDateRange.map(
          (ingredient: Ingredient) => {
            return {
              ...ingredient,
              checked: true,
            };
          }
        )
      );
    },
    onError: (error) => {},
    variables: {
      startDate: JSON.stringify(startDate),
      endDate: JSON.stringify(endDate),
      userId: user?.id,
    },
  });

  const { modalState, setModalState } = useAuthModalStore();
  if (!user) {
    setModalState({
      ...modalState,
      open: true,
      view: "login",
    });
    redirect("/");
  }

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
        <Typography variant="h6" gutterBottom>
          Shopping List
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <DatePicker
            value={dates}
            onChange={onInputChangeHandler}
            format="DD.MM.YYYY"
            weekStartDayIndex={1}
            displayWeekNumbers={true}
            range
            rangeHover
            placeholder="Choose Dates"
            style={{
              width: "15rem",
              height: "2.5rem",
              fontSize: "1rem",
              textAlign: "center",
              flexGrow: 1,
            }}
            
          />
          {data &&
            data.getUserPlannedRecipesIngredientsListByDateRange &&
            data.getUserPlannedRecipesIngredientsListByDateRange.length > 0 && (
              <IngredientsChecklist ingredients={ingredientsAll} />
            )}

          {!data && loading && (
            <Typography variant="h6" gutterBottom>
              Loading...
            </Typography>
          )}

          {data &&
            data.getUserPlannedRecipesIngredientsListByDateRange &&
            data.getUserPlannedRecipesIngredientsListByDateRange.length ===
              0 && (
              <Typography variant="h6" pt={5} gutterBottom>
                No planned recipes for this date range
              </Typography>
            )}
        </Box>
      </Box>
    </Container>
  );
}
