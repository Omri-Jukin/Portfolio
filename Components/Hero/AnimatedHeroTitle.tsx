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
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: "0.5rem",
  padding: "0 1rem",
  [theme.breakpoints.down("md")]: {
    fontSize: "2.5rem",
    letterSpacing: "0.05em",
    padding: "0 0.5rem",
    gap: "0.4rem",
  },
  [theme.breakpoints.down("sm")]: {
    fontSize: "1.8rem",
    letterSpacing: "0.03em",
    padding: "0 0.25rem",
    gap: "0.3rem",
  },
  [theme.breakpoints.down("xs")]: {
    fontSize: "1.5rem",
    letterSpacing: "0.02em",
    gap: "0.2rem",
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
  // Improve readability on mobile
  [theme.breakpoints.down("sm")]: {
    textShadow: `
      -0.5px -0.5px 0 #000,
      0.5px -0.5px 0 #000,
      -0.5px 0.5px 0 #000,
      0.5px 0.5px 0 #000,
      1px 1px 0 #000,
      -1px -1px 0 #000,
      1px -1px 0 #000,
      -1px 1px 0 #000
    `,
    WebkitTextStroke: "1px #000",
  },
  [theme.breakpoints.down("xs")]: {
    textShadow: `
      -0.25px -0.25px 0 #000,
      0.25px -0.25px 0 #000,
      -0.25px 0.25px 0 #000,
      0.25px 0.25px 0 #000,
      0.5px 0.5px 0 #000,
      -0.5px -0.5px 0 #000,
      0.5px -0.5px 0 #000,
      -0.5px 0.5px 0 #000
    `,
    WebkitTextStroke: "0.5px #000",
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

  const words = text.split(" ");

  // Create a flat array of all animatable letters with their positions
  const allLetters: Array<{
    letter: string;
    wordIndex: number;
    letterIndex: number;
    globalIndex: number;
    isAnimatable: boolean;
  }> = [];
  let globalIndex = 0;

  words.forEach((word, wordIndex) => {
    word.split("").forEach((letter, letterIndex) => {
      if (letter !== " " && letter !== "-" && letter !== "'") {
        allLetters.push({
          letter,
          wordIndex,
          letterIndex,
          globalIndex,
          isAnimatable: true,
        });
      }
      globalIndex++;
    });
  });

  const currentActiveLetter = allLetters[activeLetter];

  useEffect(() => {
    if (!autoAnimate || allLetters.length === 0) return;

    // Start immediately with a random letter
    const initialRandomIndex = Math.floor(Math.random() * allLetters.length);
    setActiveLetter(initialRandomIndex);

    // Cycle through letters randomly
    const letterInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * allLetters.length);
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
  }, [autoAnimate, allLetters.length, colors.length]);

  const currentColorValue = colors[currentColor];

  return (
    <AnimatedTitleContainer className={className || "animated-title"}>
      {words.map((word, wordIndex) => (
        <Box
          key={wordIndex}
          component="div"
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            whiteSpace: "nowrap",
          }}
        >
          {word.split("").map((letter, index) => (
            <LetterSpan
              key={`${wordIndex}-${index}`}
              className={
                letter === " "
                  ? "space"
                  : currentActiveLetter &&
                    currentActiveLetter.letter === letter &&
                    currentActiveLetter.wordIndex === wordIndex &&
                    currentActiveLetter.letterIndex === index
                  ? "active"
                  : ""
              }
              sx={{
                color:
                  letter === " "
                    ? theme.palette.text.primary
                    : currentActiveLetter &&
                      currentActiveLetter.letter === letter &&
                      currentActiveLetter.wordIndex === wordIndex &&
                      currentActiveLetter.letterIndex === index
                    ? currentColorValue
                    : theme.palette.mode === "light"
                    ? theme.paperDark
                    : theme.paperLight,
                transition: "color 0.3s ease-in-out",
                margin: letter === " " ? "0 0.2em" : "0 0.05em",
                [theme.breakpoints.down("sm")]: {
                  margin: letter === " " ? "0 0.1em" : "0 0.02em",
                },
              }}
            >
              {letter}
            </LetterSpan>
          ))}
        </Box>
      ))}
    </AnimatedTitleContainer>
  );
};

export default AnimatedHeroTitle;
