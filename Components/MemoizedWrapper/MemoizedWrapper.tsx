"use client";

import React, { memo, ReactNode } from "react";

interface MemoizedWrapperProps {
  children: ReactNode;
  name?: string;
  debug?: boolean;
}

const MemoizedWrapper: React.FC<MemoizedWrapperProps> = memo(
  ({ children, name, debug = false }) => {
    if (debug && process.env.NODE_ENV === "development") {
      console.log(`MemoizedWrapper ${name || "unnamed"} rendered`);
    }

    return <>{children}</>;
  }
);

MemoizedWrapper.displayName = "MemoizedWrapper";

export default MemoizedWrapper;
