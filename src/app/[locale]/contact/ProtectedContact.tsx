"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Tooltip,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Visibility as VisibilityIcon,
  ContentCopy as CopyIcon,
} from "@mui/icons-material";
import { getProtectedEmail, getProtectedPhone } from "./page.const";

interface ProtectedContactProps {
  type: "email" | "phone";
  onReveal?: () => void;
}

export const ProtectedContact = ({ type, onReveal }: ProtectedContactProps) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [showCopied, setShowCopied] = useState(false);

  const handleReveal = () => {
    setIsRevealed(true);
    onReveal?.();
  };

  const handleCopy = async () => {
    const value = type === "email" ? getProtectedEmail() : getProtectedPhone();
    try {
      await navigator.clipboard.writeText(value);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
    }
  };

  const getDisplayValue = () => {
    if (!isRevealed) {
      return type === "email" ? "••••••••••••••••" : "••••••••••••";
    }
    return type === "email" ? getProtectedEmail() : getProtectedPhone();
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Typography variant="body2" component="span">
        {getDisplayValue()}
      </Typography>

      {!isRevealed ? (
        <Tooltip title={`Reveal ${type}`}>
          <Button
            size="small"
            onClick={handleReveal}
            startIcon={<VisibilityIcon />}
            sx={{ minWidth: "auto", p: 0.5 }}
          >
            Reveal
          </Button>
        </Tooltip>
      ) : (
        <Tooltip title="Copy to clipboard">
          <Button
            size="small"
            onClick={handleCopy}
            startIcon={<CopyIcon />}
            sx={{ minWidth: "auto", p: 0.5 }}
          >
            Copy
          </Button>
        </Tooltip>
      )}

      <Snackbar
        open={showCopied}
        autoHideDuration={2000}
        onClose={() => setShowCopied(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          {type === "email" ? "Email" : "Phone"} copied to clipboard!
        </Alert>
      </Snackbar>
    </Box>
  );
};
