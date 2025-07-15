import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";
import type { Theme } from "@mui/material/styles";

export const FooterContainer = styled(Box)(({ theme }: { theme: Theme }) => ({
  backgroundColor: "transparent",
  padding: theme.spacing(6, 2, 2, 2),
  borderTop: `1px solid ${theme.palette.divider}`,
}));

export const FooterSection = styled(Box)(({ theme }: { theme: Theme }) => ({
  marginBottom: theme.spacing(2),
}));

export const SocialIcons = styled(Box)(({ theme }: { theme: Theme }) => ({
  display: "flex",
  gap: theme.spacing(1.5),
  marginTop: theme.spacing(1),
}));
