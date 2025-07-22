import React from "react";
import { StyledTagChip } from "./TagChip.style";
import type { TagChipProps } from "./TagChip.type";

const TagChip: React.FC<TagChipProps> = ({ tag, ...props }) => {
  return <StyledTagChip {...props}>{tag}</StyledTagChip>;
};

export default TagChip;
