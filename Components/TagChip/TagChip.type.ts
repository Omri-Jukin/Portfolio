import { HTMLAttributes } from "react";

export interface TagChipProps extends HTMLAttributes<HTMLDivElement> {
  tag: string;
  key?: string;
}
