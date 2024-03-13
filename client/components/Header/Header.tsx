"use client";
import * as React from "react";
import Typography from "@mui/material/Typography";
import UserProfile from "../UserProfile";
import AuthButtons from "../AuthButtons";
import { format } from "date-fns";
import { Button } from "@mui/material";
import { useEffect } from "react";
import { useUserStore } from "@/store/zustand/userStore";
import { useCurrentDayStore } from "@/store/zustand/currentDayStore";

const ISSERVER = typeof window !== "undefined";

export default function Header() {
  const { user } = useUserStore();
  const { setToday } = useCurrentDayStore();
  const [isSSR, setIsSSR] = React.useState(true);
  useEffect(() => {
    setIsSSR(false);
  }, []);
  return (
    <>
      {!isSSR && user ?
        <Button
          variant="outlined"
          component="div"
          onClick={() => {
            setToday(new Date());
          }}
        >
          <Typography
            color={"black"}
            textTransform={"none"}
            sx={{ flexGrow: 1 }}
          >
            Today is {format(new Date(), "dd.MM.yyyy")}
          </Typography>
        </Button>
      : null}

      {!isSSR && user ?
        <UserProfile name={user.email ?? "a"} />
      : <AuthButtons />}
    </>
  );
}
