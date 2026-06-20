"use client";

import * as React from "react";

const HOME_INTRO_EVENT = "portfolio:home-intro-finished";

type MotionGateContextValue = {
  enabled: boolean;
  durationScale: number;
};

const MotionGateContext = React.createContext<MotionGateContextValue>({
  enabled: true,
  durationScale: 1,
});

function shouldWaitForHomeIntro() {
  if (typeof document === "undefined") return false;

  return document.documentElement.dataset.homeIntro === "pending";
}

export function completeHomeIntroMotionGate() {
  if (typeof window === "undefined") return;

  window.dispatchEvent(new Event(HOME_INTRO_EVENT));
}

export function useMotionGate() {
  return React.useContext(MotionGateContext);
}

export function HomeMotionGate({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = React.useState(false);

  React.useEffect(() => {
    if (!shouldWaitForHomeIntro()) {
      setEnabled(true);
      return;
    }

    const handleIntroFinished = () => {
      setEnabled(true);
    };

    window.addEventListener(HOME_INTRO_EVENT, handleIntroFinished);
    return () => {
      window.removeEventListener(HOME_INTRO_EVENT, handleIntroFinished);
    };
  }, []);

  const value = React.useMemo(
    () => ({
      enabled,
      durationScale: 1.22,
    }),
    [enabled]
  );

  return (
    <MotionGateContext.Provider value={value}>
      {children}
    </MotionGateContext.Provider>
  );
}
