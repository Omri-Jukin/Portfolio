import { styled } from "@mui/material/styles";
import { Box, Typography, Button, Card } from "@mui/material";
import { keyframes } from "@mui/system";

export const bobbingAnimation = keyframes`
  0% {
    transform: translateY(-5px);
  }
  100% {
    transform: translateY(5px);
  }
`;

export const rotatingAnimation = keyframes`
    from: {
      msTransform: "rotate(0deg)",
      mozTransform: "rotate(0deg)",
      webkitTransform: "rotate(0deg)",
      oTransform: "rotate(0deg)",
      transform: "rotate(0deg)",
    },
    to: {
      msTransform: "rotate(360deg)",
      mozTransform: "rotate(360deg)",
      webkitTransform: "rotate(360deg)",
      oTransform: "rotate(360deg)",
      transform: "rotate(360deg)",
    },
  }
`;

export const dropVanishAnimation = keyframes`
	30% {
		transform: translate(0, -50px) rotate(180deg) scale(1);
	}

	60% {
		transform: translate(0, 20px) scale(.8) rotate(0deg);
	}

	100% {
		transform: translate(0) scale(1) rotate(0deg);
		opacity: 1;
	}
`;

export const PageContainer = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  background: theme.palette.background.paper,
}));

export const HeroContainer = styled(Box)(({ theme }) => ({
  textAlign: "center",
  marginBottom: theme.spacing(8),
}));

export const HeroTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  background: `radial-gradient(circle at 50% 50%, ${theme.palette.warm.primary} 0%, ${theme.palette.cool.primary} 40%, ${theme.palette.neutral.primary} 80%, ${theme.palette.warm.secondary} 100%)`,
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  marginBottom: theme.spacing(3),
  textShadow:
    theme.palette.mode === "dark"
      ? "0 6px 12px rgba(0, 0, 0, 0.8), 3px 3px 6px rgba(0, 0, 0, 0.6)"
      : "0 6px 12px rgba(0, 0, 0, 0.3), 3px 3px 6px rgba(0, 0, 0, 0.2)",
}));

export const HeroDescription = styled(Typography)(({ theme }) => ({
  maxWidth: "800px",
  margin: "0 auto",
  lineHeight: 1.6,
  marginBottom: theme.spacing(4),
}));

export const ButtonContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(2),
  justifyContent: "center",
  flexWrap: "wrap",
}));

export const HeroButton = styled(Button)(({ theme }) => ({
  border: `1px solid ${theme.palette.text.primary}`,
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.background.paper,
  paddingInline: theme.spacing(4),
  paddingTop: theme.spacing(1.5),
  paddingBottom: theme.spacing(1.5),
  // Always show icons, but add margin to the icon on the correct side based on direction
  "& .MuiButton-endIcon": {
    marginLeft: theme.direction === "ltr" ? theme.spacing(1.5) : 0,
    marginRight: theme.direction === "rtl" ? theme.spacing(1.5) : 0,
  },
  "& .MuiButton-startIcon": {
    marginRight: theme.direction === "ltr" ? theme.spacing(1.5) : 0,
    marginLeft: theme.direction === "rtl" ? theme.spacing(1.5) : 0,
  },
  "@keyframes bobbing": {
    "0%": {
      transform: "translateY(-5px)",
    },
    "100%": {
      transform: "translateY(5px)",
    },
  },
  "&:hover": {
    animation: `bobbing ${theme.animations.bobbing}`,
    animationDirection: "alternate",
    animationPlayState: "running",
    boxShadow: theme.shadows[6],
    backgroundColor: theme.palette.background.paper,
  },
}));

export const CardsButton = styled(Button)(({ theme }) => ({
  border: `1px solid ${theme.palette.text.primary}`,
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.background.paper,
  paddingInline: theme.spacing(4),
  paddingTop: theme.spacing(1.5),
  paddingBottom: theme.spacing(1.5),
  // Always show icons, but add margin to the icon on the correct side based on direction
  "& .MuiButton-endIcon": {
    marginLeft: theme.direction === "ltr" ? theme.spacing(1.5) : 0,
    marginRight: theme.direction === "rtl" ? theme.spacing(1.5) : 0,
  },
  "& .MuiButton-startIcon": {
    marginRight: theme.direction === "ltr" ? theme.spacing(1.5) : 0,
    marginLeft: theme.direction === "rtl" ? theme.spacing(1.5) : 0,
  },
  "@keyframes rotating": {
    from: {
      msTransform: "rotate(0deg)",
      mozTransform: "rotate(0deg)",
      webkitTransform: "rotate(0deg)",
      oTransform: "rotate(0deg)",
      transform: "rotate(0deg)",
    },
    to: {
      msTransform: "rotate(360deg)",
      mozTransform: "rotate(360deg)",
      webkitTransform: "rotate(360deg)",
      oTransform: "rotate(360deg)",
      transform: "rotate(360deg)",
    },
  },
  "@keyframes bobbing": {
    "0%": {
      transform: "translateY(-5px)",
    },
    "100%": {
      transform: "translateY(5px)",
    },
  },
  "&:hover": {
    "& .MuiButton-endIcon": {
      animation: `rotating ${theme.animations.rotating}`,
      animationDirection: "normal",
      animationPlayState: "running",
    },
    boxShadow: theme.shadows[6],
  },
}));

export const SectionCard = styled(Card)(({ theme }) => ({
  textAlign: "center",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "all 0.3s ease-in-out",
  background: theme.palette.background.paper,
  border: `1px solid ${
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, 0.1)"
      : "rgba(0, 0, 0, 0.1)"
  }`,
  boxShadow:
    theme.palette.mode === "dark"
      ? "0 8px 24px rgba(150, 206, 180, 0.25), 0 4px 12px rgba(0, 0, 0, 0.3), 2px 2px 8px rgba(0, 0, 0, 0.2)"
      : "0 8px 24px rgba(78, 205, 196, 0.2), 0 4px 12px rgba(0, 0, 0, 0.1), 2px 2px 8px rgba(0, 0, 0, 0.08)",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 12px 36px rgba(150, 206, 180, 0.35), 0 6px 18px rgba(0, 0, 0, 0.4), 3px 3px 12px rgba(0, 0, 0, 0.25)"
        : "0 12px 36px rgba(78, 205, 196, 0.3), 0 6px 18px rgba(0, 0, 0, 0.15), 3px 3px 12px rgba(0, 0, 0, 0.1)",
  },
}));

export const GridContainer = styled(Box)(() => ({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "2rem",
  "@media (max-width: 640px)": {
    gridTemplateColumns: "1fr",
  },
}));

export const IconContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginBottom: theme.spacing(2),
}));

export const SectionIcon = styled(Box)(({ theme }) => ({
  fontSize: 32,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  "& > svg": {
    fontSize: "inherit",
    width: "1em",
    height: "1em",
  },
  ...(theme.direction === "rtl"
    ? { marginLeft: theme.spacing(1.5) }
    : { marginRight: theme.spacing(1.5) }),
}));

export const SectionTitle = styled(Typography)({
  fontWeight: 600,
});

export const SectionDescription = styled(Typography)({
  lineHeight: 1.6,
});

export const SectionButton = styled(Button)({
  textTransform: "none",
  fontWeight: 500,
});
