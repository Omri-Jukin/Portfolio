import React from "react";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import { AnimationType } from "~/AnimatedBackground";

interface AnimationSwitcherProps {
  animationType: AnimationType;
  onChange: (type: AnimationType) => void;
}

const AnimationSwitcher: React.FC<AnimationSwitcherProps> = ({
  animationType,
  onChange,
}) => {
  const handleClick = () => {
    let nextType: AnimationType;
    switch (animationType) {
      case "torusKnot":
        nextType = "dna";
        break;
      case "dna":
        nextType = "stars";
        break;
      case "stars":
        nextType = "polyhedron";
        break;
      case "polyhedron":
        nextType = "torusKnot";
        break;
      default:
        nextType = "torusKnot";
    }
    onChange(nextType);
  };

  const getTooltipText = () => {
    switch (animationType) {
      case "torusKnot":
        return "Switch to DNA helix";
      case "dna":
        return "Switch to stars";
      case "stars":
        return "Switch to polyhedron";
      case "polyhedron":
        return "Switch to torus knot";
      default:
        return "Change animation background";
    }
  };

  return (
    <Tooltip title={getTooltipText()}>
      <IconButton
        color="inherit"
        onClick={handleClick}
        size="small"
        aria-label="Switch animation background"
      >
        <AutorenewIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
};

export default AnimationSwitcher;
