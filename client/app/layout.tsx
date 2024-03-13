"use client";
import * as React from "react";
import Link from "next/link";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import ThemeRegistry from "@/components/ThemeRegistry/ThemeRegistry";
import AppNavigation from "@/components/AppNavigation";
import { IconButton } from "@mui/material";
import AuthModal from "@/components/Modal/Auth/AuthModal";
import { ApolloProvider } from "@apollo/client";
import client from "@/utils/ApolloClient";
import Header from "@/components/Header/Header";
import { closeSnackbar, SnackbarProvider } from "notistack";
import CloseIcon from "@mui/icons-material/Close";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const snackRef = React.useRef<any>(null);
  return (
    <html lang="en">
      <body
        data-nextjs-scroll-focus-boundary
        style={{
          backgroundColor: "#f0f2f5",
        }}
      >
        <ApolloProvider client={client}>
          <SnackbarProvider
            maxSnack={6}
            autoHideDuration={1000}
            anchorOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            ref={snackRef}
            action={(snackbarId) => (
              <IconButton
                aria-label="delete-snackItem"
                onClick={() => closeSnackbar(snackbarId)}
              >
                <CloseIcon />
              </IconButton>
            )}
          >
            <ThemeRegistry>
              <AuthModal />
              <AppBar
                elevation={0}
                color="transparent"
                position="sticky"
                sx={{
                  backgroundColor: "#fff",
                  color: "#000",
                }}
              >
                <Toolbar>
                  <Link
                    href="/"
                    passHref
                    style={{
                      textDecoration: "none",
                      color: "#000",
                    }}
                  >
                    <Typography variant="h6" noWrap component="div">
                      Recipe Planner
                    </Typography>
                  </Link>

                  <Box sx={{ flexGrow: 1 }} />

                  <Header />
                </Toolbar>
              </AppBar>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  minHeight: "99vh",
                  margin: "0 auto",
                  maxWidth: "1000px",
                  paddingX: 2,
                  paddingTop: 4,
                  paddingBottom: 16,
                }}
              >
                {children}
              </Box>
              <AppNavigation />
            </ThemeRegistry>
          </SnackbarProvider>
        </ApolloProvider>
      </body>
    </html>
  );
}
