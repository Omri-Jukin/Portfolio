import { StyledTypography } from "./Typography.style";
import { TypographyProps } from "./Typography.type";

const Typography = ({ children, ...props }: TypographyProps) => (
  <StyledTypography {...props}>{children}</StyledTypography>
);

export default Typography;
