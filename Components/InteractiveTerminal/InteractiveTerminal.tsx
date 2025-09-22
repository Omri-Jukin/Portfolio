"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Box, Typography } from "@mui/material";
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
  TerminalTabs,
  TerminalTab,
} from "./InteractiveTerminal.style";

interface TerminalCommand {
  command: string;
  output: string | React.ReactNode;
  delay?: number;
  type?: "command" | "output" | "error" | "success";
}

interface InteractiveTerminalProps {
  onNavigate?: (section: string) => void;
  initialCommands?: TerminalCommand[];
  showTabs?: boolean;
  className?: string;
}

const InteractiveTerminal: React.FC<InteractiveTerminalProps> = ({
  onNavigate,
  initialCommands = [],
  showTabs = true,
  className,
}) => {
  const [currentCommand, setCurrentCommand] = useState("");
  const [commandHistory, setCommandHistory] = useState<TerminalCommand[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentLine, setCurrentLine] = useState(0);
  const [activeTab, setActiveTab] = useState("terminal");
  const [isExecuting, setIsExecuting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Default commands if none provided
  const defaultCommands: TerminalCommand[] = [
    {
      command: "whoami",
      output: "omri@portfolio:~$ whoami",
      type: "command",
      delay: 1000,
    },
    {
      command: "",
      output: "Omri Jukin - Full Stack Engineer",
      type: "output",
      delay: 500,
    },
    {
      command: "cat skills.txt",
      output: "omri@portfolio:~$ cat skills.txt",
      type: "command",
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
        </Box>
      ),
      type: "output",
      delay: 500,
    },
  ];

  const commands =
    initialCommands.length > 0 ? initialCommands : defaultCommands;

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

  // Handle command execution
  const executeCommand = useCallback(
    (cmd: string) => {
      setIsExecuting(true);

      const newCommand: TerminalCommand = {
        command: `omri@portfolio:~$ ${cmd}`,
        output: "",
        type: "command",
      };

      // Simulate command execution delay
      setTimeout(() => {
        switch (cmd.toLowerCase().trim()) {
          case "help":
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
                  • about - View my background and skills
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "#ffffff", fontFamily: "monospace" }}
                >
                  • projects - See my work and portfolio
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "#ffffff", fontFamily: "monospace" }}
                >
                  • contact - Get in touch with me
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "#ffffff", fontFamily: "monospace" }}
                >
                  • skills - List my technical skills
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "#ffffff", fontFamily: "monospace" }}
                >
                  • experience - View my work experience
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "#ffffff", fontFamily: "monospace" }}
                >
                  • clear - Clear terminal
                </Typography>
              </Box>
            );
            newCommand.type = "success";
            break;

          case "about":
            onNavigate?.("about");
            newCommand.output = "Navigating to about section...";
            newCommand.type = "success";
            break;

          case "projects":
            onNavigate?.("projects");
            newCommand.output = "Opening projects showcase...";
            newCommand.type = "success";
            break;

          case "contact":
            onNavigate?.("contact");
            newCommand.output = "Opening contact form...";
            newCommand.type = "success";
            break;

          case "skills":
            newCommand.output = (
              <Box>
                <Typography
                  variant="body2"
                  sx={{ color: "#00ff00", fontFamily: "monospace" }}
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
            newCommand.type = "success";
            break;

          case "experience":
            newCommand.output = (
              <Box>
                <Typography
                  variant="body2"
                  sx={{ color: "#00ff00", fontFamily: "monospace" }}
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
              </Box>
            );
            newCommand.type = "success";
            break;

          case "clear":
            setCommandHistory([]);
            setCurrentCommand("");
            setIsExecuting(false);
            return;

          case "ls":
            newCommand.output = (
              <Box>
                <Typography
                  variant="body2"
                  sx={{ color: "#00ff00", fontFamily: "monospace" }}
                >
                  about/ projects/ contact/ resume.pdf
                </Typography>
              </Box>
            );
            newCommand.type = "success";
            break;

          case "pwd":
            newCommand.output = "/home/omri/portfolio";
            newCommand.type = "output";
            break;

          case "date":
            newCommand.output = new Date().toLocaleString();
            newCommand.type = "output";
            break;

          default:
            newCommand.output = `Command not found: ${cmd}. Type 'help' for available commands.`;
            newCommand.type = "error";
        }

        setCommandHistory((prev) => [...prev, newCommand]);
        setCurrentCommand("");
        setIsExecuting(false);
      }, 500);
    },
    [onNavigate]
  );

  // Handle command submission
  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCommand.trim() || isExecuting) return;
    executeCommand(currentCommand);
  };

  // Quick command buttons
  const quickCommands = [
    { label: "About", command: "about" },
    { label: "Projects", command: "projects" },
    { label: "Skills", command: "skills" },
    { label: "Contact", command: "contact" },
  ];

  // Terminal tabs
  const tabs = [
    { id: "terminal", label: "Terminal", icon: "💻" },
    { id: "code", label: "Code", icon: "📝" },
    { id: "logs", label: "Logs", icon: "📋" },
  ];

  return (
    <TerminalContainer className={className}>
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

        {showTabs && (
          <TerminalTabs>
            {tabs.map((tab) => (
              <TerminalTab
                key={tab.id}
                active={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
              >
                <span style={{ marginRight: "8px" }}>{tab.icon}</span>
                {tab.label}
              </TerminalTab>
            ))}
          </TerminalTabs>
        )}

        <TerminalBody ref={terminalRef}>
          {commandHistory.map((cmd, index) => (
            <TerminalLine key={index} type={cmd.type}>
              <TerminalPrompt>{cmd.command}</TerminalPrompt>
              {cmd.output && (
                <Box sx={{ mt: 1 }}>
                  {typeof cmd.output === "string" ? (
                    <Typography
                      variant="body2"
                      sx={{
                        color:
                          cmd.type === "error"
                            ? "#ff0000"
                            : cmd.type === "success"
                            ? "#00ff00"
                            : "#ffffff",
                        fontFamily: "monospace",
                      }}
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

          {/* Command Input */}
          <form onSubmit={handleCommandSubmit}>
            <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
              <TerminalPrompt>omri@portfolio:~$</TerminalPrompt>
              <TerminalInput
                ref={inputRef}
                value={currentCommand}
                onChange={(e) => setCurrentCommand(e.target.value)}
                placeholder="Type a command..."
                disabled={isExecuting}
                autoFocus
              />
              {isExecuting && (
                <Typography
                  variant="body2"
                  sx={{ color: "#ffbd2e", fontFamily: "monospace", ml: 1 }}
                >
                  Executing...
                </Typography>
              )}
            </Box>
          </form>

          {/* Quick Command Buttons */}
          <Box sx={{ display: "flex", gap: 2, mt: 3, flexWrap: "wrap" }}>
            {quickCommands.map((cmd) => (
              <CommandButton
                key={cmd.command}
                onClick={() => executeCommand(cmd.command)}
                disabled={isExecuting}
                sx={{
                  backgroundColor: "rgba(0, 255, 0, 0.1)",
                  border: "1px solid rgba(0, 255, 0, 0.3)",
                  color: "#00ff00",
                  fontFamily: "monospace",
                  "&:hover": {
                    backgroundColor: "rgba(0, 255, 0, 0.2)",
                  },
                  "&:disabled": {
                    opacity: 0.5,
                    cursor: "not-allowed",
                  },
                }}
              >
                {cmd.label}
              </CommandButton>
            ))}
          </Box>
        </TerminalBody>
      </TerminalWindow>
    </TerminalContainer>
  );
};

export default InteractiveTerminal;
