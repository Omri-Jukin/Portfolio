import { AlertColor } from "@mui/material";

export type SnackbarProps = {
  open: boolean;
  message: string;
  severity: AlertColor;
  onClose?: () => void;
  autoHideDuration?: number;
};
