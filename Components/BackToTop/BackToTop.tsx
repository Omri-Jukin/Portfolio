"use client";

import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Fab, Zoom } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useCallback } from "react";
import { useScrollPosition } from "$/hooks/useScrollPosition";

const FloatingFab = styled(Fab)(({ theme }) => ({
  position: "fixed",
  right: theme.spacing(3),
  bottom: theme.spacing(3),
  zIndex: theme.zIndex.tooltip,
  background: theme.palette.background.paper,
  color: theme.palette.primary.main,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: theme.shadows[6],
  "&:hover": {
    background: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
}));

const BackToTop = () => {
  const { scrollY } = useScrollPosition();

  const handleClick = useCallback(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const shouldShow = scrollY > 400;

  return (
    <Zoom in={shouldShow}>
      <FloatingFab
        color="primary"
        size="medium"
        onClick={handleClick}
        aria-label="Back to top"
      >
        <KeyboardArrowUpIcon />
      </FloatingFab>
    </Zoom>
  );
};

export default BackToTop;
