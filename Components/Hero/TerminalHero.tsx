"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { Box, Typography } from "@mui/material";
import { SECTION_IDS } from "#/lib";
import Image from "next/image";
import Footer from "~/Footer";
import {
  TerminalContainer,
  TerminalWindow,
  TerminalHeader,
  TerminalBody,
  TerminalInput,
  TerminalLine,
  TerminalPrompt,
  TerminalCursor,
  CommandButton,
  StatusIndicator,
} from "./TerminalHero.style";
import type { HeroProps } from "./Hero.type";
import MotionWrapper from "../MotionWrapper/MotionWrapper";

interface TerminalCommand {
  command: string;
  output: string | React.ReactNode;
  delay?: number;
}

const Hero: React.FC<HeroProps> = ({
  onExploreClick,
  onAboutClick,
  onContactClick,
  profileSrc,
  ownerName,
}) => {
  const [currentCommand, setCurrentCommand] = useState("");
  const [commandHistory, setCommandHistory] = useState<TerminalCommand[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentLine, setCurrentLine] = useState(0);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [userHasScrolled, setUserHasScrolled] = useState(false);
  const [isNearBottom, setIsNearBottom] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Available commands for auto-completion
  const availableCommands = [
    "/about",
    "/projects",
    "/contact",
    "/resume",
    "/help",
    "/clear",
    "/whoami",
    "/ls",
    "/pwd",
    "/date",
    "/skills",
    "/experience",
  ];

  // Terminal commands and their outputs
  const commands: TerminalCommand[] = useMemo(
    () => [
      {
        command: "whoami",
        output: "omri@portfolio:~$ whoami",
        delay: 1000,
      },
      {
        command: "",
        output: "Omri Jukin - Full Stack Engineer",
        delay: 500,
      },
      {
        command: "cat about.txt",
        output: "omri@portfolio:~$ cat about.txt",
        delay: 1000,
      },
      {
        command: "",
        output: (
          <Box>
            <Typography
              variant="body2"
              sx={{ color: "#00ff00", fontFamily: "monospace" }}
            >
              Systems-first full-stack engineer
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#ffffff", fontFamily: "monospace", mt: 1 }}
            >
              I don&apos;t just build software; I engineer evolution.
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#ffffff", fontFamily: "monospace" }}
            >
              Currently seeking full-time opportunities to make a lasting
              impact.
            </Typography>
          </Box>
        ),
        delay: 500,
      },
      {
        command: "ls skills/",
        output: "omri@portfolio:~$ ls skills/",
        delay: 1000,
      },
      {
        command: "",
        output: (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
            {[
              "react.tsx",
              "next.js",
              "typescript.ts",
              "node.js",
              "postgresql.sql",
              "docker.yml",
            ].map((skill, index) => (
              <Typography
                key={skill}
                variant="body2"
                sx={{
                  color: index % 2 === 0 ? "#00ff00" : "#007acc",
                  fontFamily: "monospace",
                  backgroundColor: "rgba(0, 255, 0, 0.1)",
                  padding: "2px 8px",
                  borderRadius: "4px",
                  border: "1px solid rgba(0, 255, 0, 0.3)",
                }}
              >
                {skill}
              </Typography>
            ))}
          </Box>
        ),
        delay: 500,
      },
      {
        command: "git log --oneline -3",
        output: "omri@portfolio:~$ git log --oneline -3",
        delay: 1000,
      },
      {
        command: "",
        output: (
          <Box sx={{ mt: 1 }}>
            {[
              "feat: Implemented real-time collaboration system",
              "fix: Optimized database queries for 40% performance boost",
              "feat: Added PWA capabilities with offline support",
            ].map((commit, index) => (
              <Typography
                key={index}
                variant="body2"
                sx={{
                  color: "#00ff00",
                  fontFamily: "monospace",
                  fontSize: "0.875rem",
                }}
              >
                {commit}
              </Typography>
            ))}
          </Box>
        ),
        delay: 500,
      },
    ],
    []
  );

  // Auto-scroll to bottom when new content is added (like chat interface)
  const scrollToBottom = () => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  };

  // Check if user is near bottom of scroll area
  const checkIfNearBottom = () => {
    if (terminalRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = terminalRef.current;
      const threshold = 100; // pixels from bottom
      const nearBottom = scrollHeight - scrollTop - clientHeight < threshold;
      setIsNearBottom(nearBottom);
    }
  };

  // Handle scroll events
  const handleScroll = useCallback(() => {
    checkIfNearBottom();

    // Clear existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Set user as having scrolled, but reset after 2 seconds of no scrolling
    setUserHasScrolled(true);
    scrollTimeoutRef.current = setTimeout(() => {
      setUserHasScrolled(false);
    }, 2000);
  }, []);

  // Auto-scroll when new commands are added
  useEffect(() => {
    if (!userHasScrolled || isNearBottom) {
      // Small delay to ensure DOM is updated
      setTimeout(scrollToBottom, 50);
    }
  }, [commandHistory, userHasScrolled, isNearBottom]);

  // Auto-type commands
  useEffect(() => {
    if (currentLine < commands.length) {
      const command = commands[currentLine];
      setIsTyping(true);

      const timer = setTimeout(() => {
        setCommandHistory((prev) => [...prev, command]);
        setCurrentLine((prev) => prev + 1);
        setIsTyping(false);
      }, command.delay || 1000);

      return () => clearTimeout(timer);
    }
  }, [currentLine, commands]);

  // Add scroll event listener
  useEffect(() => {
    const terminal = terminalRef.current;
    if (terminal) {
      terminal.addEventListener("scroll", handleScroll);
      return () => terminal.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  // Handle command input changes with auto-completion
  const handleCommandChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCurrentCommand(value);
    setSelectedSuggestionIndex(-1); // Reset selection when typing

    if (value.trim()) {
      const matches = availableCommands.filter((cmd) =>
        cmd.toLowerCase().startsWith(value.toLowerCase())
      );
      setSuggestions(matches);
      setShowSuggestions(matches.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Handle keyboard navigation for suggestions
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedSuggestionIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedSuggestionIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case "Enter":
        if (selectedSuggestionIndex >= 0) {
          e.preventDefault();
          setCurrentCommand(suggestions[selectedSuggestionIndex]);
          setShowSuggestions(false);
          setSelectedSuggestionIndex(-1);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        break;
    }
  };

  // Handle command submission
  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCommand.trim()) return;

    const newCommand: TerminalCommand = {
      command: `omri@portfolio:~$ ${currentCommand}`,
      output: "",
    };

    // Handle specific commands
    switch (currentCommand.toLowerCase()) {
      case "/help":
        newCommand.output = (
          <Box>
            <Typography
              variant="body2"
              sx={{ color: "#00ff00", fontFamily: "monospace" }}
            >
              Available commands:
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#ffffff", fontFamily: "monospace", mt: 1 }}
            >
              • /about - View my background and skills
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#ffffff", fontFamily: "monospace" }}
            >
              • /projects - See my work and portfolio
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#ffffff", fontFamily: "monospace" }}
            >
              • /contact - Get in touch with me
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#ffffff", fontFamily: "monospace" }}
            >
              • /resume - Download my resume
            </Typography>
          </Box>
        );
        break;
      case "/about":
        onAboutClick?.();
        newCommand.output = (
          <Box>
            <Typography
              variant="body2"
              sx={{ color: "#00ff00", fontFamily: "monospace" }}
            >
              === ABOUT OMRI JUKIN ===
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#ffffff", fontFamily: "monospace", mt: 1 }}
            >
              Systems-first full-stack engineer with 2+ years of experience
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#ffffff", fontFamily: "monospace" }}
            >
              I don&apos;t just build software; I engineer evolution.
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#ffffff", fontFamily: "monospace" }}
            >
              Currently seeking full-time opportunities to make a lasting
              impact.
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#007acc", fontFamily: "monospace", mt: 2 }}
            >
              Key Skills: React, Next.js, TypeScript, Node.js, PostgreSQL
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#ffbd2e", fontFamily: "monospace" }}
            >
              Experience: 15+ projects completed, 100% critical flows automated
            </Typography>
          </Box>
        );
        break;
      case "/projects":
        onExploreClick?.();
        newCommand.output = (
          <Box>
            <Typography
              variant="body2"
              sx={{ color: "#00ff00", fontFamily: "monospace" }}
            >
              === RECENT PROJECTS ===
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#ffffff", fontFamily: "monospace", mt: 1 }}
            >
              🚀 Real-time Collaboration System
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#666", fontFamily: "monospace", ml: 2 }}
            >
              Built with React, WebSockets, and PostgreSQL
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#ffffff", fontFamily: "monospace", mt: 1 }}
            >
              ⚡ Performance Optimization Suite
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#666", fontFamily: "monospace", ml: 2 }}
            >
              Achieved 40% performance boost with database optimization
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#ffffff", fontFamily: "monospace", mt: 1 }}
            >
              📱 PWA Portfolio Platform
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#666", fontFamily: "monospace", ml: 2 }}
            >
              Offline-capable portfolio with service workers
            </Typography>
          </Box>
        );
        break;
      case "/contact":
        onContactClick?.();
        newCommand.output = (
          <Box>
            <Typography
              variant="body2"
              sx={{ color: "#00ff00", fontFamily: "monospace" }}
            >
              === CONTACT INFORMATION ===
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#ffffff", fontFamily: "monospace", mt: 1 }}
              onClick={() => {
                window.open("mailto:omrijukin@gmail.com", "_blank");
              }}
            >
              📧 Email: omrijukin@gmail.com
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#ffffff", fontFamily: "monospace" }}
              onClick={() => {
                window.open("tel:+972-52-334-4064", "_blank");
              }}
            >
              📱 Phone: +972-52-334-4064
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#ffffff", fontFamily: "monospace" }}
              onClick={() => {
                window.open("https://www.linkedin.com/in/omrijukin/", "_blank");
              }}
            >
              🌐 LinkedIn: linkedin.com/in/omrijukin
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#ffffff", fontFamily: "monospace" }}
              onClick={() => {
                window.open("https://github.com/Omri-Jukin", "_blank");
              }}
            >
              💻 GitHub: github.com/Omri-Jukin
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#007acc", fontFamily: "monospace", mt: 2 }}
            >
              Available for: Full-time positions, Freelance projects
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#ffbd2e", fontFamily: "monospace" }}
            >
              Response time: Usually within 24 hours
            </Typography>
          </Box>
        );
        break;
      case "/resume":
        onAboutClick?.();
        newCommand.output = (
          <Box>
            <Typography
              variant="body2"
              sx={{ color: "#00ff00", fontFamily: "monospace" }}
            >
              === RESUME DOWNLOAD ===
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#ffffff", fontFamily: "monospace", mt: 1 }}
            >
              📄 Omri Jukin - Full Stack Developer Resume
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#666", fontFamily: "monospace" }}
            >
              Last updated: {new Date().toLocaleDateString()}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#007acc", fontFamily: "monospace", mt: 2 }}
            >
              Available formats: PDF, DOCX
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#ffbd2e", fontFamily: "monospace" }}
            >
              Languages: English, Hebrew
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#00ff00", fontFamily: "monospace", mt: 2 }}
            >
              [Click to download resume]
            </Typography>
          </Box>
        );
        break;
      case "/clear":
        setCommandHistory([]);
        setCurrentCommand("");
        setShowSuggestions(false);
        return;
      case "/whoami":
        newCommand.output = "omri@portfolio";
        break;
      case "/ls":
        newCommand.output = (
          <Box>
            <Typography
              variant="body2"
              sx={{ color: "#00ff00", fontFamily: "monospace" }}
            >
              about/ projects/ contact/ resume.pdf skills/ experience/
            </Typography>
          </Box>
        );
        break;
      case "/pwd":
        newCommand.output = "/home/omri/portfolio";
        break;
      case "/date":
        newCommand.output = new Date().toLocaleString();
        break;
      case "/skills":
        newCommand.output = (
          <Box>
            <Typography
              variant="body2"
              sx={{ color: "#00ff00", fontFamily: "monospace" }}
            >
              === TECHNICAL SKILLS ===
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#ffffff", fontFamily: "monospace", mt: 1 }}
            >
              Frontend: React, Next.js, TypeScript, Material-UI
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#007acc", fontFamily: "monospace" }}
            >
              Backend: Node.js, Express, tRPC, PostgreSQL
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#ffbd2e", fontFamily: "monospace" }}
            >
              DevOps: Docker, AWS, Vercel, CI/CD
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#ff6b6b", fontFamily: "monospace" }}
            >
              Tools: Git, VS Code, Figma, Postman
            </Typography>
          </Box>
        );
        break;
      case "/experience":
        newCommand.output = (
          <Box>
            <Typography
              variant="body2"
              sx={{ color: "#00ff00", fontFamily: "monospace" }}
            >
              === WORK EXPERIENCE ===
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#ffffff", fontFamily: "monospace", mt: 1 }}
            >
              2+ years building resilient products
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#ffffff", fontFamily: "monospace" }}
            >
              15+ end-to-end launches across sectors
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#ffffff", fontFamily: "monospace" }}
            >
              100% critical flows covered by automation
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#007acc", fontFamily: "monospace", mt: 2 }}
            >
              Specializations: Full-stack development, System architecture
            </Typography>
          </Box>
        );
        break;
      default:
        newCommand.output = `Command not found: ${currentCommand}. Type '/help' for available commands.`;
    }

    setCommandHistory((prev) => [...prev, newCommand]);
    setCurrentCommand("");
    setShowSuggestions(false);

    // Auto-scroll to show new command output
    setTimeout(scrollToBottom, 100);
  };

  // Handle quick command button clicks (auto-press enter)
  const handleQuickCommand = (command: string) => {
    setCurrentCommand(command);
    // Simulate typing the command
    setTimeout(() => {
      const newCommand: TerminalCommand = {
        command: `omri@portfolio:~$ ${command}`,
        output: "",
      };

      // Execute the command logic with relevant content
      switch (command.toLowerCase()) {
        case "/about":
          onAboutClick?.();
          newCommand.output = (
            <Box>
              <Typography
                variant="body2"
                sx={{ color: "#00ff00", fontFamily: "monospace" }}
              >
                === ABOUT OMRI JUKIN ===
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#ffffff", fontFamily: "monospace", mt: 1 }}
              >
                Systems-first full-stack engineer with 2+ years of experience
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#ffffff", fontFamily: "monospace" }}
              >
                I don&apos;t just build software; I engineer evolution.
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#ffffff", fontFamily: "monospace" }}
              >
                Currently seeking full-time opportunities to make a lasting
                impact.
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#007acc", fontFamily: "monospace", mt: 2 }}
              >
                Key Skills: React, Next.js, TypeScript, Node.js, PostgreSQL
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#ffbd2e", fontFamily: "monospace" }}
              >
                Experience: 15+ projects completed, 100% critical flows
                automated
              </Typography>
            </Box>
          );
          break;
        case "/projects":
          onExploreClick?.();
          newCommand.output = (
            <Box>
              <Typography
                variant="body2"
                sx={{ color: "#00ff00", fontFamily: "monospace" }}
              >
                === RECENT PROJECTS ===
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#ffffff", fontFamily: "monospace", mt: 1 }}
              >
                🚀 Real-time Collaboration System
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#666", fontFamily: "monospace", ml: 2 }}
              >
                Built with React, WebSockets, and PostgreSQL
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#ffffff", fontFamily: "monospace", mt: 1 }}
              >
                ⚡ Performance Optimization Suite
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#666", fontFamily: "monospace", ml: 2 }}
              >
                Achieved 40% performance boost with database optimization
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#ffffff", fontFamily: "monospace", mt: 1 }}
              >
                📱 PWA Portfolio Platform
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#666", fontFamily: "monospace", ml: 2 }}
              >
                Offline-capable portfolio with service workers
              </Typography>
            </Box>
          );
          break;
        case "/contact":
          onContactClick?.();
          newCommand.output = (
            <Box>
              <Typography
                variant="body2"
                sx={{ color: "#00ff00", fontFamily: "monospace" }}
              >
                === CONTACT INFORMATION ===
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#ffffff", fontFamily: "monospace", mt: 1 }}
              >
                📧 Email: omrijukin@gmail.com
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#ffffff", fontFamily: "monospace" }}
              >
                📱 Phone: +972-52-334-4064
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#ffffff", fontFamily: "monospace" }}
              >
                🌐 LinkedIn: linkedin.com/in/omrijukin
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#ffffff", fontFamily: "monospace" }}
              >
                💻 GitHub: github.com/Omri-Jukin
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#007acc", fontFamily: "monospace", mt: 2 }}
              >
                Available for: Full-time positions, Freelance projects
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#ffbd2e", fontFamily: "monospace" }}
              >
                Response time: Usually within 24 hours
              </Typography>
            </Box>
          );
          break;
        case "/resume":
          onAboutClick?.();
          newCommand.output = (
            <Box>
              <Typography
                variant="body2"
                sx={{ color: "#00ff00", fontFamily: "monospace" }}
              >
                === RESUME DOWNLOAD ===
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#ffffff", fontFamily: "monospace", mt: 1 }}
              >
                📄 Omri Jukin - Full Stack Developer Resume
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#666", fontFamily: "monospace" }}
              >
                Last updated: {new Date().toLocaleDateString()}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#007acc", fontFamily: "monospace", mt: 2 }}
              >
                Available formats: PDF, DOCX
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#ffbd2e", fontFamily: "monospace" }}
              >
                Languages: English, Hebrew
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#00ff00", fontFamily: "monospace", mt: 2 }}
              >
                [Click to download resume]
              </Typography>
            </Box>
          );
          break;
      }

      setCommandHistory((prev) => [...prev, newCommand]);
      setCurrentCommand("");
      setShowSuggestions(false);

      // Auto-scroll to show new command output
      setTimeout(scrollToBottom, 150);
    }, 100);
  };

  // Quick command buttons
  const quickCommands = [
    { label: "About", command: "/about", action: onAboutClick },
    { label: "Projects", command: "/projects", action: onExploreClick },
    { label: "Contact", command: "/contact", action: onContactClick },
    { label: "Resume", command: "/resume", action: onAboutClick },
  ];

  return (
    <TerminalContainer id={SECTION_IDS.HERO}>
      <TerminalWindow>
        <TerminalHeader>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box sx={{ display: "flex", gap: 0.5 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  backgroundColor: "#ff5f57",
                }}
              />
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  backgroundColor: "#ffbd2e",
                }}
              />
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  backgroundColor: "#28ca42",
                }}
              />
            </Box>
            <Typography
              variant="body2"
              sx={{ color: "#ffffff", fontFamily: "monospace", ml: 2 }}
            >
              Terminal - omri@portfolio
            </Typography>
          </Box>
        </TerminalHeader>

        <TerminalBody ref={terminalRef}>
          {/* Scrollable Content Area */}
          <Box sx={{ flex: 1, overflowY: "auto", paddingRight: "8px" }}>
            {/* Profile Section */}
            <Box sx={{ display: "flex", gap: 4, mb: 4 }}>
              <Box sx={{ flex: 1 }}>
                {commandHistory.map((cmd, index) => (
                  <TerminalLine key={index}>
                    <TerminalPrompt>{cmd.command}</TerminalPrompt>
                    {cmd.output && (
                      <Box sx={{ mt: 1 }}>
                        {typeof cmd.output === "string" ? (
                          <Typography
                            variant="body2"
                            sx={{ color: "#ffffff", fontFamily: "monospace" }}
                          >
                            {cmd.output}
                          </Typography>
                        ) : (
                          cmd.output
                        )}
                      </Box>
                    )}
                  </TerminalLine>
                ))}

                {isTyping && (
                  <TerminalLine>
                    <TerminalPrompt>
                      omri@portfolio:~$
                      <TerminalCursor />
                    </TerminalPrompt>
                  </TerminalLine>
                )}
              </Box>

              {/* Profile Image - Fixed Position */}
              <Box
                sx={{
                  flex: 0,
                  minWidth: 200,
                  position: "fixed",
                  top: "50%",
                  right: "2rem",
                  transform: "translateY(-50%)",
                  zIndex: 10,
                }}
              >
                <MotionWrapper variant="fadeIn" duration={1.0} delay={2.0}>
                  <Box
                    sx={{
                      position: "relative",
                      width: 200,
                      height: 200,
                      borderRadius: "12px",
                      overflow: "hidden",
                      border: "2px solid #00ff00",
                      boxShadow: "0 0 20px rgba(0, 255, 0, 0.3)",
                    }}
                  >
                    {profileSrc && (
                      <Image
                        src={profileSrc}
                        alt={
                          ownerName
                            ? `${ownerName} profile photo`
                            : "Profile photo"
                        }
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    )}
                  </Box>
                </MotionWrapper>
              </Box>
            </Box>

            {/* Status Indicators */}
            <Box sx={{ display: "flex", gap: 3, mb: 4, flexWrap: "wrap" }}>
              <StatusIndicator>
                <Typography
                  variant="body2"
                  sx={{ color: "#00ff00", fontFamily: "monospace" }}
                >
                  ● Available for work
                </Typography>
              </StatusIndicator>
              <StatusIndicator>
                <Typography
                  variant="body2"
                  sx={{ color: "#007acc", fontFamily: "monospace" }}
                >
                  ● 2+ years experience
                </Typography>
              </StatusIndicator>
              <StatusIndicator>
                <Typography
                  variant="body2"
                  sx={{ color: "#ffbd2e", fontFamily: "monospace" }}
                >
                  ● 15+ projects completed
                </Typography>
              </StatusIndicator>
            </Box>
          </Box>

          {/* Fixed Input Area - Always at bottom */}
          <Box
            sx={{
              flexShrink: 0,
              borderTop: "1px solid rgba(0, 255, 0, 0.2)",
              paddingTop: "1rem",
              backgroundColor: "#0d1117", // Match terminal background
              position: "sticky",
              bottom: 0,
            }}
          >
            {/* Command Input */}
            <form onSubmit={handleCommandSubmit}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  position: "relative",
                }}
              >
                <TerminalPrompt>omri@portfolio:~$</TerminalPrompt>
                <TerminalInput
                  ref={inputRef}
                  value={currentCommand}
                  onChange={handleCommandChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a command (e.g., /help)..."
                  autoFocus
                  sx={{ paddingLeft: "12px" }} // Push text inward from curved border
                />

                {/* Auto-completion suggestions */}
                {showSuggestions && suggestions.length > 0 && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: "100%",
                      left: 0, // Start from the beginning of the input field
                      right: 0, // Extend to the end of the input field
                      backgroundColor: "#161b22",
                      border: "1px solid rgba(0, 255, 0, 0.3)",
                      borderRadius: "4px",
                      zIndex: 1000,
                      maxHeight: "200px",
                      overflowY: "auto",
                    }}
                  >
                    {suggestions.map((suggestion, index) => (
                      <Box
                        key={suggestion}
                        onClick={() => {
                          setCurrentCommand(suggestion);
                          setShowSuggestions(false);
                          setSelectedSuggestionIndex(-1);
                          inputRef.current?.focus();
                        }}
                        sx={{
                          padding: "8px 12px",
                          cursor: "pointer",
                          color: "#ffffff",
                          fontFamily: "monospace",
                          fontSize: "0.875rem",
                          borderBottom:
                            index < suggestions.length - 1
                              ? "1px solid rgba(0, 255, 0, 0.1)"
                              : "none",
                          backgroundColor:
                            selectedSuggestionIndex === index
                              ? "rgba(0, 255, 0, 0.2)"
                              : "transparent",
                          "&:hover": {
                            backgroundColor: "rgba(0, 255, 0, 0.1)",
                          },
                        }}
                      >
                        {suggestion}
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            </form>

            {/* Quick Command Buttons */}
            <Box sx={{ display: "flex", gap: 2, mt: 2, flexWrap: "wrap" }}>
              {quickCommands.map((cmd) => (
                <CommandButton
                  key={cmd.command}
                  onClick={() => handleQuickCommand(cmd.command)}
                  sx={{
                    backgroundColor: "rgba(0, 255, 0, 0.1)",
                    border: "1px solid rgba(0, 255, 0, 0.3)",
                    color: "#00ff00",
                    fontFamily: "monospace",
                    "&:hover": {
                      backgroundColor: "rgba(0, 255, 0, 0.2)",
                    },
                  }}
                >
                  {cmd.label}
                </CommandButton>
              ))}
            </Box>
          </Box>
        </TerminalBody>
      </TerminalWindow>

      {/* Footer under the terminal */}
      <Box sx={{ width: "100%", maxWidth: "1200px", mt: 2 }}>
        <Footer />
      </Box>
    </TerminalContainer>
  );
};

export default Hero;
