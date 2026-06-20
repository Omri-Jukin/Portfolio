"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { completeHomeIntroMotionGate } from "@/components/ui/motion";

const SESSION_KEY = "portfolio:reload-terminal-intro:v2";
const COMMAND = "~/omri.dev $ load proof --role=full-stack-engineer";
const READY_LINE = "\u2713 portfolio ready";
const TOTAL_DURATION_MS = 5000;
const TYPE_DELAY_MS = 420;
const TYPE_DURATION_MS = 1700;
const READY_DELAY_MS = 2480;
const DISSOLVE_DELAY_MS = 3180;
const AUTO_DISMISS_DELAY_MS = TOTAL_DURATION_MS;

type WindowWithInitialPath = Window & {
  __PORTFOLIO_INITIAL_PATH__?: string;
};

function clearIntroBootCover() {
  if (typeof document === "undefined") return;

  document.documentElement.removeAttribute("data-home-intro");
}

function shouldRenderInitialIntro() {
  if (typeof document === "undefined") return false;

  return document.documentElement.dataset.homeIntro === "pending";
}

type TerminalChar = {
  id: string;
  char: string;
  line: "command" | "ready";
  index: number;
};

type PanelBubble = {
  id: string;
  left: number;
  top: number;
  size: number;
  driftX: number;
  rise: number;
  delay: number;
  duration: number;
};

const PANEL_BUBBLES: PanelBubble[] = [
  { id: "b0", left: 8, top: 78, size: 9, driftX: -36, rise: 170, delay: 0.04, duration: 1.5 },
  { id: "b1", left: 13, top: 42, size: 5, driftX: -18, rise: 132, delay: 0.08, duration: 1.25 },
  { id: "b2", left: 18, top: 64, size: 13, driftX: 22, rise: 188, delay: 0.02, duration: 1.55 },
  { id: "b3", left: 23, top: 30, size: 7, driftX: -12, rise: 145, delay: 0.16, duration: 1.3 },
  { id: "b4", left: 28, top: 83, size: 11, driftX: 34, rise: 210, delay: 0.1, duration: 1.65 },
  { id: "b5", left: 34, top: 53, size: 6, driftX: -28, rise: 150, delay: 0.18, duration: 1.35 },
  { id: "b6", left: 39, top: 74, size: 15, driftX: 16, rise: 230, delay: 0.06, duration: 1.7 },
  { id: "b7", left: 45, top: 38, size: 8, driftX: 40, rise: 166, delay: 0.2, duration: 1.45 },
  { id: "b8", left: 51, top: 86, size: 10, driftX: -22, rise: 205, delay: 0.14, duration: 1.6 },
  { id: "b9", left: 57, top: 58, size: 6, driftX: 24, rise: 156, delay: 0.24, duration: 1.32 },
  { id: "b10", left: 63, top: 76, size: 14, driftX: -40, rise: 224, delay: 0.12, duration: 1.68 },
  { id: "b11", left: 69, top: 34, size: 7, driftX: 18, rise: 142, delay: 0.26, duration: 1.38 },
  { id: "b12", left: 75, top: 66, size: 12, driftX: -14, rise: 196, delay: 0.18, duration: 1.58 },
  { id: "b13", left: 81, top: 45, size: 5, driftX: 36, rise: 136, delay: 0.3, duration: 1.25 },
  { id: "b14", left: 87, top: 80, size: 11, driftX: -30, rise: 214, delay: 0.22, duration: 1.62 },
  { id: "b15", left: 92, top: 56, size: 8, driftX: 12, rise: 174, delay: 0.34, duration: 1.42 },
  { id: "b16", left: 6, top: 22, size: 4, driftX: 18, rise: 120, delay: 0.32, duration: 1.18 },
  { id: "b17", left: 16, top: 18, size: 6, driftX: -20, rise: 150, delay: 0.38, duration: 1.3 },
  { id: "b18", left: 31, top: 20, size: 4, driftX: 26, rise: 128, delay: 0.42, duration: 1.2 },
  { id: "b19", left: 48, top: 16, size: 7, driftX: -16, rise: 170, delay: 0.36, duration: 1.36 },
  { id: "b20", left: 66, top: 19, size: 5, driftX: 20, rise: 146, delay: 0.44, duration: 1.24 },
  { id: "b21", left: 83, top: 24, size: 6, driftX: -24, rise: 158, delay: 0.4, duration: 1.32 },
];

function shouldShowIntro(reducedMotion: boolean | null) {
  if (reducedMotion) return false;
  if (typeof window === "undefined") return false;
  if (window.location.pathname !== "/") return false;

  const initialPath = (window as WindowWithInitialPath)
    .__PORTFOLIO_INITIAL_PATH__;

  if (initialPath !== "/") return false;

  try {
    if (window.sessionStorage.getItem(SESSION_KEY)) {
      return false;
    }

    window.sessionStorage.setItem(SESSION_KEY, "shown");
    return true;
  } catch {
    return true;
  }
}

function getBubbleDrift(index: number, line: "command" | "ready") {
  const direction = index % 2 === 0 ? 1 : -1;
  const driftX = direction * (8 + (index % 7) * 5);
  const driftY = -(52 + (index % 6) * 18 + (line === "ready" ? 10 : 0));

  return { driftX, driftY };
}

function TerminalCharacter({
  item,
  dissolving,
}: {
  item: TerminalChar;
  dissolving: boolean;
}) {
  const isPrompt = item.line === "command" && item.index < "~/omri.dev $".length;
  const isReady = item.line === "ready";
  const isSpace = item.char === " ";
  const { driftX, driftY } = getBubbleDrift(item.index, item.line);
  const bubbleDelay = (item.index % 13) * 0.018 + (item.line === "ready" ? 0.08 : 0);

  return (
    <motion.span
      className={
        "relative inline-grid h-[1.35em] min-w-[0.58em] place-items-center align-bottom whitespace-pre rounded-full text-center"
      }
      initial={{ opacity: 0, y: 3 }}
      animate={
        dissolving
          ? {
              opacity: 0,
              x: driftX,
              y: driftY,
              scale: isSpace ? 0.25 : 0.48,
              color: "rgba(0,0,0,0)",
              backgroundColor: isSpace ? "rgba(0,0,0,0)" : "var(--accent)",
              boxShadow: isSpace ? "none" : "0 0 18px color-mix(in srgb, var(--accent) 34%, transparent)",
            }
          : {
              opacity: 1,
              x: 0,
              y: 0,
              scale: 1,
              color: isReady
                ? "var(--success)"
                : isPrompt
                  ? "var(--accent)"
                  : "var(--foreground)",
              backgroundColor: "rgba(0,0,0,0)",
              boxShadow: "none",
            }
      }
      transition={
        dissolving
          ? {
              duration: 1.35,
              delay: bubbleDelay,
              ease: [0.22, 1, 0.36, 1],
            }
          : { duration: 0.16, ease: "easeOut" }
      }
    >
      {isSpace ? "\u00A0" : item.char}
    </motion.span>
  );
}

function TerminalLine({
  line,
  text,
  dissolving,
}: {
  line: "command" | "ready";
  text: string;
  dissolving: boolean;
}) {
  const items = React.useMemo<TerminalChar[]>(
    () =>
      Array.from(text).map((char, index) => ({
        id: `${line}-${index}-${char}`,
        char,
        line,
        index,
      })),
    [line, text]
  );

  return (
    <p className="min-h-[1.75rem] break-words">
      {items.map((item) => (
        <TerminalCharacter
          key={item.id}
          item={item}
          dissolving={dissolving}
        />
      ))}
    </p>
  );
}

function TerminalPanelBubbles({ active }: { active: boolean }) {
  if (!active) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible">
      {PANEL_BUBBLES.map((bubble) => (
        <motion.span
          key={bubble.id}
          aria-hidden="true"
          className="absolute rounded-full border border-accent/40 bg-accent/20 shadow-[0_0_22px_color-mix(in_srgb,var(--accent)_32%,transparent)]"
          initial={{
            opacity: 0,
            scale: 0.4,
            x: 0,
            y: 0,
          }}
          animate={{
            opacity: [0, 0.8, 0.62, 0],
            scale: [0.35, 1, 0.9, 0.55],
            x: [0, bubble.driftX * 0.35, bubble.driftX],
            y: [0, -bubble.rise * 0.55, -bubble.rise],
          }}
          transition={{
            duration: bubble.duration,
            delay: bubble.delay,
            ease: [0.22, 1, 0.36, 1],
            times: [0, 0.2, 0.68, 1],
          }}
          style={{
            left: `${bubble.left}%`,
            top: `${bubble.top}%`,
            height: bubble.size,
            width: bubble.size,
          }}
        />
      ))}
    </div>
  );
}

export function ReloadTerminalIntro() {
  const reducedMotion = useReducedMotion();
  const [visible, setVisible] = React.useState(shouldRenderInitialIntro);
  const [typedText, setTypedText] = React.useState("");
  const [readyVisible, setReadyVisible] = React.useState(false);
  const [dissolving, setDissolving] = React.useState(false);

  const dismiss = React.useCallback(() => {
    clearIntroBootCover();
    completeHomeIntroMotionGate();
    setVisible(false);
  }, []);

  React.useEffect(() => {
    if (!shouldShowIntro(reducedMotion)) {
      clearIntroBootCover();
      completeHomeIntroMotionGate();
      return;
    }

    setVisible(true);
  }, [reducedMotion]);

  React.useEffect(() => {
    if (!visible) return;

    const bootCoverFrame = window.requestAnimationFrame(clearIntroBootCover);
    const cleanupTasks: Array<() => void> = [];
    const typeStepMs = TYPE_DURATION_MS / COMMAND.length;

    const startTypingTimer = window.setTimeout(() => {
      let index = 0;
      const typeTimer = window.setInterval(() => {
        index += 1;
        setTypedText(COMMAND.slice(0, index));

        if (index >= COMMAND.length) {
          window.clearInterval(typeTimer);
        }
      }, typeStepMs);

      cleanupTasks.push(() => window.clearInterval(typeTimer));
    }, TYPE_DELAY_MS);

    cleanupTasks.push(() => window.clearTimeout(startTypingTimer));

    const readyTimer = window.setTimeout(() => {
      setReadyVisible(true);
    }, READY_DELAY_MS);

    cleanupTasks.push(() => window.clearTimeout(readyTimer));

    const dissolveTimer = window.setTimeout(() => {
      setDissolving(true);
    }, DISSOLVE_DELAY_MS);

    cleanupTasks.push(() => window.clearTimeout(dissolveTimer));

    const dismissTimer = window.setTimeout(() => {
      dismiss();
    }, AUTO_DISMISS_DELAY_MS);

    cleanupTasks.push(() => window.clearTimeout(dismissTimer));

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismiss();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.cancelAnimationFrame(bootCoverFrame);
      cleanupTasks.forEach((cleanup) => cleanup());
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [dismiss, visible]);

  return (
    <>
      <div
        aria-hidden="true"
        className="home-intro-boot-cover fixed inset-0 z-[99] place-items-center bg-background px-4 text-foreground"
      >
        <div className="relative w-full max-w-[min(42rem,calc(100vw-2rem))] overflow-hidden rounded-lg border border-border bg-card px-4 py-5 font-mono text-card-foreground sm:px-6 sm:py-6">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
          <div className="min-h-[5.5rem] text-[0.78rem] leading-7 sm:text-sm">
            <span className="inline-block h-4 w-2 translate-y-0.5 bg-accent home-intro-boot-cover__cursor" />
          </div>
        </div>
      </div>

      <AnimatePresence initial={false} onExitComplete={completeHomeIntroMotionGate}>
        {visible ? (
          <motion.div
            aria-label="Portfolio loading intro"
            className="fixed inset-0 z-[100] grid cursor-pointer place-items-center bg-background px-4 text-foreground"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
            onPointerDown={dismiss}
          >
            <motion.div
              className="relative w-full max-w-[min(42rem,calc(100vw-2rem))] rounded-lg px-4 py-5 font-mono text-card-foreground sm:px-6 sm:py-6"
              initial={{ y: 14, scale: 0.982 }}
              animate={
                dissolving
                  ? {
                      y: -4,
                      scale: 0.988,
                    }
                  : { y: 0, scale: 1 }
              }
              exit={{ y: -10, scale: 0.986, opacity: 0 }}
              transition={{
                duration: dissolving ? 1.1 : 0.58,
                ease: [0.22, 1, 0.36, 1],
              }}
              onPointerDown={(event) => {
                event.stopPropagation();
                dismiss();
              }}
            >
              <motion.div
                aria-hidden="true"
                className="absolute inset-0 rounded-lg border border-border bg-card"
                animate={
                  dissolving
                    ? {
                        opacity: 0,
                        scaleY: 0.86,
                        y: -18,
                        borderColor:
                          "color-mix(in srgb, var(--accent) 18%, transparent)",
                        backgroundColor:
                          "color-mix(in srgb, var(--card) 28%, transparent)",
                      }
                    : {
                        opacity: 1,
                        scaleY: 1,
                        y: 0,
                        borderColor: "var(--border)",
                        backgroundColor: "var(--card)",
                      }
                }
                transition={{
                  duration: dissolving ? 1.28 : 0.58,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
              <TerminalPanelBubbles active={dissolving} />
              <motion.div
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent"
                initial={{ opacity: 0, scaleX: 0.18 }}
                animate={
                  dissolving
                    ? { opacity: 0, scaleX: 0.82 }
                    : { opacity: 1, scaleX: 1 }
                }
                transition={{
                  duration: 0.72,
                  delay: dissolving ? 0 : 0.18,
                  ease: "easeOut",
                }}
              />

              <div className="relative z-10 min-h-[5.5rem] text-[0.78rem] leading-7 sm:text-sm">
                <TerminalLine
                  line="command"
                  text={typedText}
                  dissolving={dissolving}
                />

                <AnimatePresence>
                  {readyVisible ? (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.36, ease: "easeOut" }}
                    >
                      <TerminalLine
                        line="ready"
                        text={READY_LINE}
                        dissolving={dissolving}
                      />
                    </motion.div>
                  ) : null}
                </AnimatePresence>

                {!dissolving ? (
                  <motion.span
                    aria-hidden="true"
                    className="ml-1 inline-block h-4 w-2 translate-y-0.5 bg-accent"
                    animate={{ opacity: [1, 0.25, 1] }}
                    transition={{ duration: 0.7, repeat: 3 }}
                  />
                ) : null}
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
