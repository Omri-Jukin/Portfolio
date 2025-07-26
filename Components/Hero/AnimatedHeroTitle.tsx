import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";

const AnimatedTitleContainer = styled(Box)(({ theme }) => ({
  fontSize: "4rem",
  fontWeight: 700,
  textAlign: "center",
  marginBottom: theme.spacing(2),
  fontFamily: 'var(--font-bona-nova-sc), "Bona Nova SC", serif',
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexWrap: "wrap",
  [theme.breakpoints.down("md")]: {
    fontSize: "2.5rem",
  },
  [theme.breakpoints.down("sm")]: {
    fontSize: "2rem",
  },
}));

const LetterSpan = styled("span")(({ theme }) => ({
  display: "inline-block",
  transition: "all 0.3s ease",
  // Create stroke effect using text-shadow
  textShadow: `
    -1px -1px 0 #000,
    1px -1px 0 #000,
    -1px 1px 0 #000,
    1px 1px 0 #000,
    2px 2px 0 #000,
    -2px -2px 0 #000,
    2px -2px 0 #000,
    -2px 2px 0 #000
  `,
  // Alternative: Use webkit-text-stroke (better performance but less browser support)
  WebkitTextStroke: "2px #000",
  "&.active": {
    transform: "scale(1.4)",
    textShadow: "none",
    WebkitTextStroke: "none",
  },
}));

interface AnimatedHeroTitleProps {
  text: string;
  className?: string;
  autoAnimate?: boolean;
}

const AnimatedHeroTitle: React.FC<AnimatedHeroTitleProps> = ({
  text,
  className,
  autoAnimate = true,
}) => {
  const theme = useTheme();
  const [currentColor, setCurrentColor] = useState(0);
  const [activeLetter, setActiveLetter] = useState(0);

  // Color palette for the animation
  const colors = [
    "#4ECDC4", // Teal
    "#FF6B6B", // Red
    "#96CEB4", // Green
    "#64B5F6", // Blue
    "#F06292", // Pink
    "#FFB74D", // Orange
    "#9575CD", // Purple
    "#81C784", // Light Green
  ];

  // Filter out spaces and punctuation for animation
  const letters = text.split("").map((letter, index) => ({
    letter,
    index,
    isAnimatable: letter !== " " && letter !== "-" && letter !== "'",
  }));

  const animatableLetters = letters.filter((l) => l.isAnimatable);

  useEffect(() => {
    if (!autoAnimate || animatableLetters.length === 0) return;

    // Start immediately with a random letter
    const initialRandomIndex = Math.floor(
      Math.random() * animatableLetters.length
    );
    setActiveLetter(initialRandomIndex);

    // Cycle through letters randomly
    const letterInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * animatableLetters.length);
      setActiveLetter(randomIndex);
    }, 300); // Change letter every 300ms

    // Cycle through colors
    const colorInterval = setInterval(() => {
      setCurrentColor((prev) => (prev + 1) % colors.length);
    }, 1000); // Change color every 1 second

    return () => {
      clearInterval(letterInterval);
      clearInterval(colorInterval);
    };
  }, [autoAnimate, animatableLetters.length, colors.length]);

  const currentColorValue = colors[currentColor];
  const currentActiveIndex = animatableLetters[activeLetter]?.index || 0;

  return (
    <AnimatedTitleContainer className={className || "animated-title"}>
      {letters.map(({ letter, index, isAnimatable }) => (
        <LetterSpan
          key={index}
          className={
            isAnimatable && index === currentActiveIndex ? "active" : ""
          }
          sx={{
            color:
              isAnimatable && index === currentActiveIndex
                ? currentColorValue
                : theme.palette.mode === "light"
                ? theme.paperDark
                : theme.paperLight,
            transition: "color 0.3s ease-in-out",
            margin: letter === " " ? "0 0.2em" : "0 0.05em",
          }}
        >
          {letter}
        </LetterSpan>
      ))}
    </AnimatedTitleContainer>
  );
};

export default AnimatedHeroTitle;
