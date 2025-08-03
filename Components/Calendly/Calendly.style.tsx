import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

export const CalendlyContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== "calendlyPosition",
})<{ calendlyPosition?: string }>(({ theme, calendlyPosition }) => {
  const isBottomPosition = calendlyPosition?.includes("bottom");

  return {
    // Base styles
    position: "fixed",
    zIndex: 999,

    // Desktop positioning
    ...(calendlyPosition === "bottom-right" && {
      bottom: "1.25rem",
      right: "1.25rem",
    }),
    ...(calendlyPosition === "bottom-left" && {
      bottom: "1.25rem",
      left: "1.25rem",
    }),
    ...(calendlyPosition === "bottom-center" && {
      bottom: "1.25rem",
      left: "50%",
      transform: "translateX(-50%)",
    }),
    ...(calendlyPosition === "top-right" && {
      top: "1.25rem",
      right: "1.25rem",
    }),
    ...(calendlyPosition === "top-left" && {
      top: "1.25rem",
      left: "1.25rem",
    }),
    ...(calendlyPosition === "top-center" && {
      top: "1.25rem",
      left: "50%",
      transform: "translateX(-50%)",
    }),
    ...(calendlyPosition === "center" && {
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    }),
    ...(calendlyPosition === "center-left" && {
      top: "50%",
      left: "1.25rem",
      transform: "translateY(-50%)",
    }),
    ...(calendlyPosition === "center-right" && {
      top: "50%",
      right: "1.25rem",
      transform: "translateY(-50%)",
    }),

    // Mobile responsive styles
    [theme.breakpoints.down("md")]: {
      ...(isBottomPosition
        ? {
            // For bottom positions on mobile, make it full-width and centered
            bottom: "1rem",
            left: "1rem",
            right: "1rem",
            transform: "none",
            width: "auto",
            maxWidth: "none",

            // Target Calendly buttons for full width
            "& button, & [data-calendly-popup-button]": {
              width: "100%",
              padding: "1rem 1.5rem",
              fontSize: "1.125rem",
              borderRadius: "0.75rem",
              boxSizing: "border-box",
            },
          }
        : {
            // For non-bottom positions, keep original positioning but ensure visibility
            zIndex: 999,
          }),
    },
  };
});
