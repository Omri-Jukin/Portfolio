import { HTMLAttributes } from "react";
import { SxProps } from "@mui/material";

export interface TagChipProps extends HTMLAttributes<HTMLDivElement> {
  tag: string;
  key?: string;
  sx?: SxProps;
}
