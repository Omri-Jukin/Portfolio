"use client";

import React, { useState, useEffect } from "react";
import { Box, Skeleton, CircularProgress } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledSkeletonContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  width: "100%",
}));

const StyledLoadingContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "200px",
  width: "100%",
  gap: theme.spacing(2),
}));

interface ClientOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  skeleton?: boolean;
  loading?: boolean;
  minHeight?: string | number;
}

export const ClientOnly: React.FC<ClientOnlyProps> = ({
  children,
  fallback,
  skeleton = false,
  loading = false,
  minHeight = "200px",
}) => {
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsClient(true);
    // Small delay to ensure smooth transition
    const timer = setTimeout(() => setIsLoading(false), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!isClient) {
    if (skeleton) {
      return (
        <StyledSkeletonContainer sx={{ minHeight }}>
          <Skeleton variant="rectangular" height={60} />
          <Skeleton variant="rectangular" height={40} />
          <Skeleton variant="rectangular" height={40} />
          <Skeleton variant="rectangular" height={80} />
          <Skeleton variant="rectangular" height={40} />
        </StyledSkeletonContainer>
      );
    }

    if (loading) {
      return (
        <StyledLoadingContainer sx={{ minHeight }}>
          <CircularProgress />
        </StyledLoadingContainer>
      );
    }

    return fallback || null;
  }

  if (isLoading) {
    if (skeleton) {
      return (
        <StyledSkeletonContainer sx={{ minHeight }}>
          <Skeleton variant="rectangular" height={60} />
          <Skeleton variant="rectangular" height={40} />
          <Skeleton variant="rectangular" height={40} />
          <Skeleton variant="rectangular" height={80} />
          <Skeleton variant="rectangular" height={40} />
        </StyledSkeletonContainer>
      );
    }

    if (loading) {
      return (
        <StyledLoadingContainer sx={{ minHeight }}>
          <CircularProgress />
        </StyledLoadingContainer>
      );
    }
  }

  return <Box>{children}</Box>;
};

export default ClientOnly;
