"use client";

import * as React from "react";

interface CountUpOptions {
  duration?: number;
  enabled?: boolean;
  idleValue?: number;
}

export function useCountUp(target: number, options: CountUpOptions = {}) {
  const { duration = 1000, enabled = true, idleValue = target } = options;
  const [value, setValue] = React.useState(enabled ? 0 : idleValue);

  React.useEffect(() => {
    if (!enabled) {
      setValue(idleValue);
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      setValue(target);
      return;
    }

    setValue(0);

    let frame = 0;
    let startTime: number | null = null;

    const tick = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setValue(Math.round(target * eased));

      if (progress < 1) {
        frame = window.requestAnimationFrame(tick);
      }
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [duration, enabled, idleValue, target]);

  return value;
}
