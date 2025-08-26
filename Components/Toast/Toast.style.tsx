import { styled } from "@mui/material/styles";
import { ToastContainer, ToastContainerProps } from "react-toastify";
import { ToastType } from "./Toast.type";

export type CustomToastType = ToastContainerProps & {
  type: ToastType;
};

export const StyledToast = styled(ToastContainer)<CustomToastType>(
  ({ theme, type }) => {
    let backgroundColor;
    switch (type) {
      case "success":
        backgroundColor = theme.palette.success.main;
        break;
      case "error":
        backgroundColor = theme.palette.error.main;
        break;
      case "warning":
        backgroundColor = theme.palette.warning.main;
        break;
      case "info":
        backgroundColor = theme.palette.info.main;
        break;
      default:
        backgroundColor = theme.palette.background.paper;
        break;
    }
    return {
      backgroundColor,
    };
  }
);
