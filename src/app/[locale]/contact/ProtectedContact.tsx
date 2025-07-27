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
  label: string;
  onReveal?: () => void;
}

export const ProtectedContact = ({
  type,
  label,
  onReveal,
}: ProtectedContactProps) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [showCopied, setShowCopied] = useState(false);

  const handleReveal = () => {
    setIsRevealed(true);
    onReveal?.();
  };

  const handleCopy = async () => {
    const contact =
      type === "email" ? getProtectedEmail() : getProtectedPhone();
    try {
      await navigator.clipboard.writeText(contact);
      setShowCopied(true);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const getContactValue = () => {
    return type === "email" ? getProtectedEmail() : getProtectedPhone();
  };

  return (
    <Box>
      {!isRevealed ? (
        <Tooltip title={`Click to reveal ${type}`}>
          <Button
            onClick={handleReveal}
            variant="outlined"
            size="small"
            startIcon={<VisibilityIcon />}
            sx={{
              borderColor: "rgba(255, 255, 255, 0.3)",
              color: "rgba(255, 255, 255, 0.8)",
              "&:hover": {
                borderColor: "rgba(255, 255, 255, 0.5)",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
              },
            }}
          >
            Click to reveal {type}
          </Button>
        </Tooltip>
      ) : (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography
            variant="body2"
            sx={{
              fontFamily: "monospace",
              color: "rgba(255, 255, 255, 0.9)",
              fontSize: "0.9rem",
            }}
          >
            {getContactValue()}
          </Typography>
          <Tooltip title="Copy to clipboard">
            <Button
              onClick={handleCopy}
              size="small"
              startIcon={<CopyIcon />}
              sx={{
                minWidth: "auto",
                padding: "4px 8px",
                color: "rgba(255, 255, 255, 0.7)",
                "&:hover": {
                  color: "rgba(255, 255, 255, 1)",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            />
          </Tooltip>
        </Box>
      )}

      <Snackbar
        open={showCopied}
        autoHideDuration={2000}
        onClose={() => setShowCopied(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setShowCopied(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          {type === "email" ? "Email" : "Phone number"} copied to clipboard!
        </Alert>
      </Snackbar>
    </Box>
  );
};
