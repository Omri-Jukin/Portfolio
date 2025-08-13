import {
  StyledTypography,
  MarqueeText,
  MarqueeTextContent,
  MarqueeBlur,
  MarqueeClear,
} from "./Typography.style";
import { TypographyProps } from "./Typography.type";

const Typography = ({ children, ...props }: TypographyProps) => (
  <StyledTypography {...props}>{children}</StyledTypography>
);

export interface MarqueeProps {
  text: string;
  className?: string;
}

const Marquee: React.FC<MarqueeProps> = ({ text, className }) => {
  return (
    <MarqueeText className={className}>
      <MarqueeTextContent>{text}</MarqueeTextContent>
      <MarqueeBlur>
        <Typography>{text}</Typography>
      </MarqueeBlur>
      <MarqueeClear>
        <Typography>{text}</Typography>
      </MarqueeClear>
    </MarqueeText>
  );
};

export { Typography, Marquee };
