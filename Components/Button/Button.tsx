import { Button as MuiButton } from "@mui/material";
import { ButtonProps as CustomButtonProps } from "./Button.type";

export default function Button({ children, ...props }: CustomButtonProps) {
  return <MuiButton {...props}>{children}</MuiButton>;
}
