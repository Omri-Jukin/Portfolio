import React from "react";
import {
  Box,
  Skeleton as MuiSkeleton,
  SkeletonProps as MuiSkeletonProps,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledSkeletonContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  width: "100%",
}));

const StyledCardSkeleton = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
}));

const StyledGridSkeleton = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: theme.spacing(2),
  width: "100%",
}));

interface SkeletonProps extends Omit<MuiSkeletonProps, "variant"> {
  variant?:
    | "text"
    | "circular"
    | "rectangular"
    | "card"
    | "grid"
    | "form"
    | "table";
  count?: number;
  height?: number | string;
  width?: number | string;
  spacing?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = "text",
  count = 1,
  height,
  width,
  spacing = 2,
  ...props
}) => {
  const renderSkeleton = () => {
    switch (variant) {
      case "card":
        return (
          <StyledCardSkeleton>
            <MuiSkeleton
              variant="rectangular"
              height={60}
              sx={{ mb: spacing }}
            />
            <MuiSkeleton variant="text" width="80%" sx={{ mb: spacing }} />
            <MuiSkeleton variant="text" width="60%" sx={{ mb: spacing }} />
            <MuiSkeleton variant="rectangular" height={100} />
          </StyledCardSkeleton>
        );

      case "grid":
        return (
          <StyledGridSkeleton>
            {Array.from({ length: count }).map((_, index) => (
              <StyledCardSkeleton key={index}>
                <MuiSkeleton
                  variant="rectangular"
                  height={60}
                  sx={{ mb: spacing }}
                />
                <MuiSkeleton variant="text" width="80%" sx={{ mb: spacing }} />
                <MuiSkeleton variant="text" width="60%" sx={{ mb: spacing }} />
                <MuiSkeleton variant="rectangular" height={100} />
              </StyledCardSkeleton>
            ))}
          </StyledGridSkeleton>
        );

      case "form":
        return (
          <StyledSkeletonContainer>
            <MuiSkeleton variant="rectangular" height={56} />
            <MuiSkeleton variant="rectangular" height={56} />
            <MuiSkeleton variant="rectangular" height={56} />
            <MuiSkeleton variant="rectangular" height={120} />
            <MuiSkeleton variant="rectangular" height={56} />
          </StyledSkeletonContainer>
        );

      case "table":
        return (
          <StyledSkeletonContainer>
            <MuiSkeleton variant="rectangular" height={48} />
            {Array.from({ length: count }).map((_, index) => (
              <MuiSkeleton key={index} variant="rectangular" height={40} />
            ))}
          </StyledSkeletonContainer>
        );

      default:
        return (
          <MuiSkeleton
            variant={variant}
            height={height}
            width={width}
            {...props}
          />
        );
    }
  };

  if (variant === "grid" || variant === "card") {
    return renderSkeleton();
  }

  return (
    <StyledSkeletonContainer>
      {Array.from({ length: count }).map((_, index) => (
        <Box key={index}>{renderSkeleton()}</Box>
      ))}
    </StyledSkeletonContainer>
  );
};

export default Skeleton;
