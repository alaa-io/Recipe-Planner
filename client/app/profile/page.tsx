"use client";
import * as React from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ScrollUp from "@/components/ScrollUp";
import { useUserStore } from "@/store/zustand/userStore";
import { Card } from "@mui/material";
import { redirect } from "next/navigation";
import { useAuthModalStore } from "@/store/zustand/authModalStore";
export default function StarredPage() {
  const { user } = useUserStore();

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
          Profile
        </Typography>
        <Card
          sx={{
            position: "relative",
            width: "80%",
            height: "80%",
            p: 2,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 4,
              width: "100%",
              height: "100%",
            }}
          >
            <Typography variant="h6" gutterBottom>
              Name: {user?.name}
            </Typography>
            <Typography variant="h6" gutterBottom>
              Email: {user?.email}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 4,
              width: "100%",
              height: "100%",
            }}
          >
            <Typography variant="h6" gutterBottom>
              Recipes: 0
            </Typography>
            <Typography variant="h6" gutterBottom>
              Planned Recipes: 0
            </Typography>
            <Typography variant="h6" gutterBottom>
              Starred Recipes: 0
            </Typography>
          </Box>
        </Card>
      </Box>
    </Container>
  );
}
