import {
  AnimatedTextContainer,
  HoverWrapper,
  StyledAnimatedText,
} from "./AnimatedText.style";
import type { AnimatedTextProps } from "./AnimatedText.type";
import { generateFromColorPalette } from "./AnimatedText.utils";
import { useMemo } from "react";

const AnimatedText = ({
  children,
  type,
  length,
  fontSize,
  fontWeight,
  scale,
  opacity,
  translateY,
}: AnimatedTextProps) => {
  // If children is a string, split it into individual characters for the grid
  // If children is already an array or other type, use as is
  const textContent =
    typeof children === "string" ? children : children?.toString() || "";
  const shouldSplitChars = length && length > 1;

  // Generate colors once and memoize them - use deterministic generation
  const letterColors = useMemo(() => {
    if (shouldSplitChars) {
      return textContent
        .split("")
        .slice(0, length)
        .map((char, index) =>
          generateFromColorPalette(`${textContent}-${index}`)
        );
    }
    return [generateFromColorPalette(textContent)];
  }, [textContent, length, shouldSplitChars]);

  return (
    <AnimatedTextContainer
      id="animated-text-container"
      type={type}
      length={shouldSplitChars ? length : 1}
    >
      {shouldSplitChars ? (
        // Render each character in its own grid cell
        textContent
          .split("")
          .slice(0, length)
          .map((char, index) => (
            <HoverWrapper key={index} id={`animated-text-${index}`}>
              <StyledAnimatedText
                type={type}
                scale={scale}
                opacity={opacity}
                translateY={translateY}
                id={`animated-text-${index}`}
                hoverColor={letterColors[index]}
                fontSize={fontSize}
                fontWeight={fontWeight}
              >
                {char === " " ? "\u00A0" : char} {/* Preserve spaces */}
              </StyledAnimatedText>
            </HoverWrapper>
          ))
      ) : (
        // Render as single text block
        <HoverWrapper id="animated-text-container-single">
          <StyledAnimatedText
            type={type}
            scale={scale}
            opacity={opacity}
            translateY={translateY}
            id="animated-text-container-single"
            variant="h1"
            hoverColor={letterColors[0]}
            fontSize={fontSize}
          >
            {children}
          </StyledAnimatedText>
        </HoverWrapper>
      )}
    </AnimatedTextContainer>
  );
};

export default AnimatedText;
