import {
  StyledTypography,
  MarqueeText,
  MarqueeTextContent,
  MarqueeBlur,
  MarqueeClear,
} from "./Typography.style";
import { TypographyProps } from "./Typography.type";

const Typography = ({ children, id, ...props }: TypographyProps) => (
  <StyledTypography id={id} {...props}>
    {children}
  </StyledTypography>
);

export interface MarqueeProps {
  text: string;
  className?: string;
  id?: string;
}

const Marquee: React.FC<MarqueeProps> = ({ text, className, id }) => {
  return (
    <MarqueeText className={className} id={id}>
      <MarqueeTextContent>{text}</MarqueeTextContent>
      <MarqueeBlur>
        <Typography id={id}>{text}</Typography>
      </MarqueeBlur>
      <MarqueeClear>
        <Typography id={id}>{text}</Typography>
      </MarqueeClear>
    </MarqueeText>
  );
};

export { Typography, Marquee };
