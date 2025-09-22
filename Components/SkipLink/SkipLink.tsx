"use client";

import React, { useEffect } from "react";
import { createSkipLink } from "$/utils/accessibility";

interface SkipLinkProps {
  targetId: string;
  label: string;
}

const SkipLink: React.FC<SkipLinkProps> = ({ targetId, label }) => {
  useEffect(() => {
    const skipLink = createSkipLink(targetId, label);
    document.body.appendChild(skipLink);

    return () => {
      if (document.body.contains(skipLink)) {
        document.body.removeChild(skipLink);
      }
    };
  }, [targetId, label]);

  return null;
};

export default SkipLink;
