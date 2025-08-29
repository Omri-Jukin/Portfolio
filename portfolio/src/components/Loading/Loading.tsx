import { Box, Typography, CircularProgress } from "@mui/material";

interface LoadingProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

export default function Loading({
  size = "md",
  text = "Loading...",
  className = "",
}: LoadingProps) {
  const sizeMap = {
    sm: 16,
    md: 32,
    lg: 48,
  };

  return (
    <Box 
      className={className}
      sx={{ 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        justifyContent: "center" 
      }}
    >
      <CircularProgress 
        size={sizeMap[size]} 
        sx={{ 
          color: "primary.main",
          "& .MuiCircularProgress-circle": {
            strokeLinecap: "round",
          }
        }}
      />
      {text && (
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ mt: 1 }}
        >
          {text}
        </Typography>
      )}
    </Box>
  );
}
