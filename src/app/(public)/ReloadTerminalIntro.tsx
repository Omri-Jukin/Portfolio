"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

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

type TerminalChar = {
  id: string;
  char: string;
  line: "command" | "ready";
  index: number;
};

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

export function ReloadTerminalIntro() {
  const reducedMotion = useReducedMotion();
  const [visible, setVisible] = React.useState(false);
  const [typedText, setTypedText] = React.useState("");
  const [readyVisible, setReadyVisible] = React.useState(false);
  const [dissolving, setDissolving] = React.useState(false);

  const dismiss = React.useCallback(() => {
    clearIntroBootCover();
    setVisible(false);
  }, []);

  React.useEffect(() => {
    if (!shouldShowIntro(reducedMotion)) {
      clearIntroBootCover();
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
        <div className="relative w-full max-w-[min(42rem,calc(100vw-2rem))] overflow-hidden rounded-lg border border-border bg-card px-4 py-5 font-mono text-card-foreground shadow-2xl shadow-black/10 dark:shadow-black/40 sm:px-6 sm:py-6">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
          <div className="min-h-[5.5rem] text-[0.78rem] leading-7 sm:text-sm">
            <span className="inline-block h-4 w-2 translate-y-0.5 bg-accent home-intro-boot-cover__cursor" />
          </div>
        </div>
      </div>

      <AnimatePresence initial={false}>
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
              className="relative w-full max-w-[min(42rem,calc(100vw-2rem))] overflow-hidden rounded-lg border border-border bg-card px-4 py-5 font-mono text-card-foreground shadow-2xl shadow-black/10 dark:shadow-black/40 sm:px-6 sm:py-6"
              initial={{ y: 14, scale: 0.982 }}
              animate={
                dissolving
                  ? {
                      y: -4,
                      scale: 0.988,
                      borderColor:
                        "color-mix(in srgb, var(--border) 25%, transparent)",
                      backgroundColor:
                        "color-mix(in srgb, var(--card) 70%, transparent)",
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

              <div className="relative min-h-[5.5rem] text-[0.78rem] leading-7 sm:text-sm">
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
