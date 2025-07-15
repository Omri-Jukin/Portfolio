import React from "react";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import { AnimationType } from "../AnimatedBackground";

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
        nextType = "sphere";
        break;
      case "sphere":
        nextType = "stars";
        break;
      case "stars":
        nextType = "torusKnot";
        break;
      default:
        nextType = "torusKnot";
    }
    onChange(nextType);
  };

  return (
    <Tooltip title="Change animation background">
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
