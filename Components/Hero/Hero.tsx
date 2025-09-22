"use client";

import React from "react";
import type { HeroProps } from "./Hero.type";
import TerminalHero from "./TerminalHero";

const Hero: React.FC<HeroProps> = (props) => {
  return <TerminalHero {...props} />;
};

export default Hero;
