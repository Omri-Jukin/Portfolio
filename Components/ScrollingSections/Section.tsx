import React from "react";
import { Container } from "@mui/material";
import type { SectionProps } from "./Section.type";
import { SectionContent } from "./Section.style";
import ResponsiveBackground from "./ResponsiveBackground";

const Section: React.FC<SectionProps> = ({
  variant,
  children,
  backgroundElements,
  ...props
}) => {
  return (
    <ResponsiveBackground variant={variant} {...props}>
      {backgroundElements}
      <SectionContent>
        <Container maxWidth="lg">{children}</Container>
      </SectionContent>
    </ResponsiveBackground>
  );
};

export default Section;
