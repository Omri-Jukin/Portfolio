import { Box, Typography } from "@mui/material";

export default function CareerPage() {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h1" component="h1" gutterBottom>
        Career
      </Typography>
      <Typography variant="body1" component="p" gutterBottom>
        My career journey
      </Typography>
      <Typography variant="body1" component="p" gutterBottom>
        I'm a passionate developer who loves creating amazing web experiences.
      </Typography>
    </Box>
  );
}
