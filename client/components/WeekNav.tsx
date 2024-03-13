import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { Button, Container, Grid, Tooltip, Typography } from "@mui/material";
import addWeeks from "date-fns/addWeeks";
import getISOWeek from "date-fns/getISOWeek";
import getYear from "date-fns/getYear";
import { useCurrentDayStore } from "@/store/zustand/currentDayStore";
export interface WeekNavProps {
  dateNow: Date;
}

const WeekNav = (props: WeekNavProps): JSX.Element => {
  const { setToday } = useCurrentDayStore();
  const { dateNow } = props;
  const currentWeek = getISOWeek(dateNow);
  const currentYear = getYear(dateNow);

  const minusWeek = (): void => {
    const newDate = addWeeks(dateNow, -1);

    setToday(newDate);
  };
  const plusWeek = (): void => {
    const newDate = addWeeks(dateNow, 1);

    setToday(newDate);
  };

  return (
    <Container maxWidth="sm">
      <Grid
        item
        container
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignContent="center"
        whiteSpace={"nowrap"}
      >
        <Grid item>
          <Tooltip title={"Previous Week"} placement="left">
            <Button variant="contained" size="small" onClick={minusWeek}>
              <ArrowLeftIcon fontSize="large" />
            </Button>
          </Tooltip>
        </Grid>
        <Grid item>
          <Typography variant="h6">
            Week{" "}
            <span
              style={{
                fontWeight: "bold",
              }}
            >
              {currentWeek}
            </span>{" "}
            /<span>{currentYear}</span>
          </Typography>
        </Grid>
        <Grid item>
          {" "}
          <Tooltip title={"Next Week"} placement="right">
            <Button variant="contained" size="small" onClick={plusWeek}>
              <ArrowRightIcon fontSize="large" />
            </Button>
          </Tooltip>
        </Grid>
      </Grid>
    </Container>
  );
};

export default WeekNav;
