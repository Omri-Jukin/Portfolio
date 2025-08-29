import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";

export const StyledMotionWrapper = styled(motion.div)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: theme.spacing(2),
}));
