"use client";
import * as React from "react";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AppNavigation() {
  const path = usePathname();

  const items = [
    {
      url: "/",
      label: "Planner",
      icon: <CalendarTodayIcon color="primary" />,
    },
    {
      url: "/shopping",
      label: "Shopping",
      icon: <ShoppingCartIcon color="primary" />,
    },

    {
      url: "/search",
      label: "Search",
      icon: <SearchIcon color="primary" />,
    },
    {
      url: "/profile",
      label: "Profile",
      icon: <AccountCircleIcon color="primary" />,
    },
  ];

  const linkes: React.ReactNode = items.map((item) => {
    return (
      <BottomNavigationAction
        key={item.label}
        LinkComponent={Link}
        href={item.url}
        label={item.label}
        icon={item.icon}
      />
    );
  });

  return (
    <BottomNavigation
      showLabels
      value={
        path === "/" || path.startsWith("/days/") ? 0
        : path === "/shopping" ?
          1
        : path === "/search" || path.startsWith("/recipes/") ?
          2
        : path === "/profile" ?
          3
        : null
      }
      sx={{
        borderTop: "1px solid #eaeaea",
        width: "99vw",
        position: "fixed",
        bottom: 0,
        "& .Mui-selected": {
          backgroundColor: "#eaeaea",
          transform: "scale(1.1)",
          transition: "transform 0.2s ease-in-out",
        },
      }}
    >
      {linkes}
    </BottomNavigation>
  );
}
