import { StyledTypography } from "./Typography.style";
import { TypographyProps } from "./Typography.type";

export const Typography = ({ children, ...props }: TypographyProps) => (
  <StyledTypography {...props}>{children}</StyledTypography>
);
