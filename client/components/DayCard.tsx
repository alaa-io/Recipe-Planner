import * as React from "react";
import Image from "next/image";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import { Container, Grid, Stack } from "@mui/material";
import Link from "next/link";
import { useCurrentDayStore } from "@/store/zustand/currentDayStore";
type Recipe = {
  id: string;
  name: string;
  image: string;
  ingredients: string[];
  instructions: string[];
};

export interface DayCardProps {
  date: number;
  recipes: Recipe[] | undefined;
}

export default function DayCard({
  date,
  recipes,
}: {
  date: number;
  recipes: Recipe[] | undefined;
}) {
  const { setToday } = useCurrentDayStore();
  return (
    <Container
      maxWidth="sm"
      sx={{
        paddingTop: "0.3rem",
        paddingBottom: "0.3rem",
      }}
    >
      <Grid container alignItems="center" justifyContent="center">
        <Grid item xs={12}>
          <Link
            href={"/days/" + `${date}`}
            style={{
              textDecoration: "none",
            }}
          >
            <Card
              onClick={(e) => {
                setToday(new Date(date));
              }}
              sx={{
                display: "flex",
                minHeight: 110,
                ":hover": {
                  boxShadow: 5,
                  cursor: "pointer",
                },
                borderRadius: "0.5rem",
                textDecoration: "none",
              }}
            >
              <Container
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "left",
                  alignItems: "left",
                  width: "100%",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1.5rem",
                    textAlign: "left",
                  }}
                >
                  {new Date(date).toLocaleDateString("en-DE", {
                    weekday: "long",
                  })}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.9rem",
                    textAlign: "left",
                    color: "grey",
                  }}
                >
                  {new Date(date).toLocaleDateString("en-DE", {
                    day: "numeric",
                    month: "long",
                  })}
                </Typography>
                <Grid
                  container
                  sx={{
                    width: "100%",
                    paddingBottom: "1rem",
                  }}
                >
                  {recipes?.map((recipe) => (
                    <Stack
                      key={recipe.id}
                      display={"flex"}
                      justifyContent={"space-around"}
                      p={1}
                    >
                      <Image
                        alt="Random image"
                        src={recipe.image}
                        width={100}
                        height={50}
                        style={{
                          maxWidth: "100%",
                          height: "100px",
                          objectFit: "cover",
                          borderRadius: "0.5rem",
                        }}
                      />
                    </Stack>
                  ))}
                </Grid>
              </Container>
            </Card>
          </Link>
        </Grid>
      </Grid>
    </Container>
  );
}
