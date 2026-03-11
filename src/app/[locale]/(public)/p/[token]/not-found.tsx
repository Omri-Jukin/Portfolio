import { Box, Typography, Button } from "@mui/material";
import Link from "next/link";

export default function NotFound() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        p: 3,
        textAlign: "center",
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Proposal Not Found
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        The proposal link you are looking for does not exist or has expired.
      </Typography>
      <Button variant="contained" component={Link} href="/">
        Go to Homepage
      </Button>
    </Box>
  );
}
