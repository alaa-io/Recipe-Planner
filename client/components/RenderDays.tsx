import { useUserStore } from "@/store/zustand/userStore";
import { startOfWeek } from "date-fns";
import DayCard from "./DayCard";
import { gql, useQuery } from "@apollo/client";
import client from "@/utils/ApolloClient";
import { Container, Grid, Skeleton } from "@mui/material";
import { useCurrentDayStore } from "@/store/zustand/currentDayStore";

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

interface DayCardWithRecipesProps {
  date: number;
  userId: string;
  timestamp: string;
}

const DayCardWithRecipes = (props: DayCardWithRecipesProps): JSX.Element => {
  const { data, loading, error } = useQuery(GET_RECIPE_BY_ID, {
    variables: { date: props.timestamp, userId: props.userId },
    onCompleted: () => {
      //
      client.refetchQueries({
        include: ["GetUserPlannedRecipes"],
      });
    },
  });

  if (loading) {
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
          <Skeleton variant="rectangular" height={110} />
        </Container>
      </Grid>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const recipesDayCurrentDay = data?.getUserPlannedRecipes ?? [];
  return (
    <DayCard
      key={props.date}
      date={props.date}
      recipes={recipesDayCurrentDay}
    />
  );
};

const RenderDays = (): JSX.Element => {
  const { user } = useUserStore();
  const { today } = useCurrentDayStore();

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const DayCards: JSX.Element[] = weekDays.map(
    (day: string, index: number): JSX.Element => {
      const currentDate = new Date(
        startOfWeek(new Date(today), { weekStartsOn: 1 })
      );
      currentDate.setDate(currentDate.getDate() + index);

      if (user?.id) {
        return (
          <DayCardWithRecipes
            key={currentDate.getTime()}
            date={currentDate.getTime()}
            userId={user.id}
            timestamp={currentDate.getTime().toString()}
          />
        );
      } else {
        return (
          <DayCard
            key={currentDate.getTime()}
            date={currentDate.getTime()}
            recipes={undefined}
          />
        );
      }
    }
  );

  return (
    <Grid
      container
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{ marginTop: "1rem" }}
    >
      {DayCards}
    </Grid>
  );
};

export default RenderDays;
