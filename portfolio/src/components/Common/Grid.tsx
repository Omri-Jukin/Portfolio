import React from "react";
import { Grid as MuiGrid, GridProps } from "@mui/material";
import { styled } from "@mui/material/styles";

// Styled Grid component that handles the common props we use
const StyledGrid = styled(MuiGrid)<GridProps>(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
}));

interface CustomGridProps extends Omit<GridProps, "component"> {
  component?: React.ElementType;
  item?: boolean;
  container?: boolean;
  xs?: number | boolean | "auto";
  sm?: number | boolean | "auto";
  md?: number | boolean | "auto";
  lg?: number | boolean | "auto";
  xl?: number | boolean | "auto";
}

export const Grid: React.FC<CustomGridProps> = ({
  component = "div",
  children,
  ...props
}) => {
  return (
    <StyledGrid component={component} {...props}>
      {children}
    </StyledGrid>
  );
};

export default Grid;
