"use client";

import React from "react";
import { Header } from "#/Components/Header";
import AnimatedBackground, { AnimationType } from "~/AnimatedBackground";
import Footer from "./Footer";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [animationType, setAnimationType] =
    React.useState<AnimationType>("torusKnot");

  return (
    <>
      <Header
        animationType={animationType}
        onAnimationTypeChange={setAnimationType}
      />
      <AnimatedBackground animationType={animationType} />
      {children}
      <Footer />
    </>
  );
}
