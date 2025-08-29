import React from "react";
import type { SkillTagProps } from "./SkillTag.type";
import { StyledSkillTag } from "./SkillTag.style";

const SkillTag: React.FC<SkillTagProps> = ({
  children,
  onClick,
  disabled = false,
  className,
  ...props
}) => {
  return (
    <StyledSkillTag
      onClick={onClick}
      disabled={disabled}
      className={className}
      {...props}
    >
      {children}
    </StyledSkillTag>
  );
};

export default SkillTag;
