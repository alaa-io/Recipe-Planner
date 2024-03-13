"use client";
import * as React from "react";
import Button from "@mui/material/Button";
import { useAuthModalStore } from "@/store/zustand/authModalStore";

export default function AuthButtons() {
  const { setModalState } = useAuthModalStore();
  return (
    <>
      <Button onClick={() => setModalState({ open: true, view: "login" })}>
        Log In
      </Button>
      <Button onClick={() => setModalState({ open: true, view: "signup" })}>
        Sign Up
      </Button>
    </>
  );
}
