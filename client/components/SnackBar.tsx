import MuiAlert, { AlertProps } from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import React from "react";
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  }
);

export interface BasicSnackbarProps {
  open: boolean;
  severity: "error" | "info" | "success" | "warning";
  message: string;
  onClose: (event?: React.SyntheticEvent | Event, reason?: string) => void;
}

// creates an alert when a recipe is added or deleted
const BasicSnackbar = (props: BasicSnackbarProps): JSX.Element => {
  const { open, severity, message, onClose } = props;
  return (
    <>
      <Snackbar
        open={open}
        autoHideDuration={1000}
        onClose={onClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={onClose} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default BasicSnackbar;
