"use client";
import * as React from "react";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Link from "next/link";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { redirect } from "next/navigation";
import { blue } from "@mui/material/colors";
import { ListItemIcon, ListItemText } from "@mui/material";
import { Logout } from "@mui/icons-material";
import { useUserStore } from "@/store/zustand/userStore";
import { useSnackStore } from "@/store/zustand/snackbarStore";

interface UserProfileProps {
  name: string;
}
export default function UserProfile({ name }: UserProfileProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { qSnack } = useSnackStore();
  const { logout } = useUserStore();
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <Avatar
          id="basic-button"
          alt={name}
          sx={{ bgcolor: blue[500] }}
          src="/images/avatar/1.jpg"
        />
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        sx={{
          padding: "1rem",
          borderRadius: "1rem",
          boxShadow: 2,
        }}
      >
        <MenuItem
          LinkComponent={Link}
          href="/"
          onClick={() =>
            {
              logout();
              qSnack({ msg: "Logged out", severity: "success" });
              localStorage.removeItem("token");
              handleClose();
              redirect("/");
            }
          }
        >
          {" "}
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>
    </div>
  );
}
