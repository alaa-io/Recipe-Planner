"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import WeekNav from "@/components/WeekNav";
import RenderDays from "@/components/RenderDays";
import { useCurrentDayStore } from "@/store/zustand/currentDayStore";
import { useUserStore } from "@/store/zustand/userStore";

export default function HomePage() {
  const { today } = useCurrentDayStore();
  const { refetchUserPlannedRecipes } = useUserStore();

  React.useEffect(() => {
    refetchUserPlannedRecipes();
  }, [today]);

  return (
    <Box>
      <div>
        <WeekNav dateNow={new Date(today)} />
        <Grid container rowSpacing={3} columnSpacing={3} pt={1}>
          <Grid xs={12}>
            <RenderDays />
          </Grid>
        </Grid>
      </div>
    </Box>
  );
}
