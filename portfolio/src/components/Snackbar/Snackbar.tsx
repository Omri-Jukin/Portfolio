"use client";

import React from "react";
import { Snackbar as MuiSnackbar, Alert } from "@mui/material";
import { SnackbarProps } from "./Snackbar.type";

const Snackbar: React.FC<SnackbarProps> = ({
  open,
  message,
  severity,
  onClose,
  autoHideDuration = 6000,
}) => {
  return (
    <MuiSnackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </MuiSnackbar>
  );
};

export default Snackbar;
