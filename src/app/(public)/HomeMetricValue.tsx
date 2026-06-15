"use client";

import * as React from "react";
import { useCountUp } from "@/components/ui/motion";

interface HomeMetricValueProps {
  value: string;
}

const numericMetricPattern = /^(\d+)(.*)$/;

export function HomeMetricValue({ value }: HomeMetricValueProps) {
  const match = numericMetricPattern.exec(value.trim());
  const [hasStarted, setHasStarted] = React.useState(false);
  const ref = React.useRef<HTMLSpanElement>(null);
  const target = match ? Number(match[1]) : 0;
  const suffix = match?.[2] ?? "";
  const count = useCountUp(target, {
    duration: 1000,
    enabled: hasStarted && Boolean(match),
  });

  React.useEffect(() => {
    const element = ref.current;
    if (!element || !match) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [match]);

  if (!match) {
    return <span>{value}</span>;
  }

  return (
    <span ref={ref}>
      {hasStarted ? count : target}
      {suffix}
    </span>
  );
}
