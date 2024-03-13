import React from "react";
import Modal from "@mui/material/Modal";
import { IconButton, Stack, useTheme } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

interface ModalWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function ModalWrapper({
  isOpen,
  onClose,
  children,
}: ModalWrapperProps) {
  const theme = useTheme();
  return (
    <div>
      <Modal
        open={isOpen}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <>
          <Stack
            spacing={2}
            direction="column"
            justifyContent="flex-end"
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              position: "absolute" as "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              [theme.breakpoints.up("xs")]: {
                width: "80%",
              },
              [theme.breakpoints.up("md")]: {
                width: "50%",
              },

              [theme.breakpoints.up("xl")]: {
                width: "30%",
              },
              bgcolor: "background.paper",
              borderRadius: "1rem",
              boxShadow: 24,
              p: 4,
            }}
          >
            <IconButton
              edge="start"
              sx={{
                position: "absolute" as "absolute",
                top: 0,
                right: 0,
                padding: "1rem",
              }}
              onClick={onClose}
            >
              <CloseIcon />
            </IconButton>
            {children}
          </Stack>
        </>
      </Modal>
    </div>
  );
}
