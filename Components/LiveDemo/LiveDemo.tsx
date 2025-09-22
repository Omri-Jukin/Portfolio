"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  LinearProgress,
} from "@mui/material";
import {
  PlayArrow,
  Stop,
  Refresh,
  BugReport,
  Speed,
  Memory,
  NetworkCheck,
} from "@mui/icons-material";
import {
  LiveDemoContainer,
  DemoHeader,
  DemoControls,
  DemoOutput,
  ConsoleLogs,
  LogEntry,
  MetricsPanel,
  MetricItem,
  DemoFrame,
} from "./LiveDemo.style";

interface LiveDemoProps {
  project: Project;
  onRun?: () => void;
  onStop?: () => void;
  onRestart?: () => void;
  className?: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  demoUrl?: string;
  repoUrl?: string;
  status: "stopped" | "running" | "error" | "building";
}

interface LogEntry {
  id: string;
  timestamp: Date;
  level: "info" | "warn" | "error" | "success";
  message: string;
  source?: string;
}

const LiveDemo: React.FC<LiveDemoProps> = ({
  project,
  onRun,
  onStop,
  onRestart,
  className,
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [isBuilding, setIsBuilding] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [metrics, setMetrics] = useState({
    cpu: 0,
    memory: 0,
    network: 0,
    responseTime: 0,
  });
  const [buildProgress, setBuildProgress] = useState(0);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logs to bottom
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // Simulate metrics updates
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setMetrics(() => ({
        cpu: Math.random() * 100,
        memory: Math.random() * 100,
        network: Math.random() * 100,
        responseTime: Math.random() * 1000,
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const addLog = (
    level: LogEntry["level"],
    message: string,
    source?: string
  ) => {
    const newLog: LogEntry = {
      id: Date.now().toString(),
      timestamp: new Date(),
      level,
      message,
      source,
    };
    setLogs((prev) => [...prev, newLog]);
  };

  const handleRun = () => {
    if (isRunning) return;

    setIsBuilding(true);
    setBuildProgress(0);
    addLog("info", "Starting build process...", "build");

    // Simulate build process
    const buildInterval = setInterval(() => {
      setBuildProgress((prev) => {
        if (prev >= 100) {
          clearInterval(buildInterval);
          setIsBuilding(false);
          setIsRunning(true);
          addLog("success", "Build completed successfully!", "build");
          addLog("info", "Starting development server...", "server");
          addLog(
            "success",
            "Server running on http://localhost:3000",
            "server"
          );
          onRun?.();
          return 100;
        }
        return prev + Math.random() * 10;
      });
    }, 200);
  };

  const handleStop = () => {
    setIsRunning(false);
    addLog("warn", "Stopping server...", "server");
    addLog("info", "Server stopped", "server");
    onStop?.();
  };

  const handleRestart = () => {
    handleStop();
    setTimeout(() => {
      handleRun();
    }, 1000);
    onRestart?.();
  };

  const handleDebug = () => {
    addLog("info", "Opening debugger...", "debug");
    addLog("info", "Breakpoints set at line 42, 67", "debug");
    addLog("info", "Debugger ready", "debug");
  };

  const getStatusColor = () => {
    if (isBuilding) return "#ffbd2e";
    if (isRunning) return "#00ff00";
    return "#666";
  };

  const getStatusText = () => {
    if (isBuilding) return "Building...";
    if (isRunning) return "Running";
    return "Stopped";
  };

  return (
    <LiveDemoContainer className={className}>
      <DemoHeader>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: getStatusColor(),
              animation: isRunning ? "pulse 2s infinite" : "none",
            }}
          />
          <Typography
            variant="h6"
            sx={{ color: "#ffffff", fontFamily: "monospace" }}
          >
            {project.name} - {getStatusText()}
          </Typography>
        </Box>

        <DemoControls>
          <Tooltip title="Run Demo">
            <IconButton
              onClick={handleRun}
              disabled={isRunning || isBuilding}
              sx={{ color: "#00ff00" }}
            >
              <PlayArrow />
            </IconButton>
          </Tooltip>

          <Tooltip title="Stop Demo">
            <IconButton
              onClick={handleStop}
              disabled={!isRunning}
              sx={{ color: "#ff0000" }}
            >
              <Stop />
            </IconButton>
          </Tooltip>

          <Tooltip title="Restart Demo">
            <IconButton
              onClick={handleRestart}
              disabled={isBuilding}
              sx={{ color: "#007acc" }}
            >
              <Refresh />
            </IconButton>
          </Tooltip>

          <Tooltip title="Debug">
            <IconButton onClick={handleDebug} sx={{ color: "#ffbd2e" }}>
              <BugReport />
            </IconButton>
          </Tooltip>
        </DemoControls>
      </DemoHeader>

      {isBuilding && (
        <Box sx={{ p: 2, borderBottom: "1px solid rgba(0, 255, 0, 0.2)" }}>
          <Typography
            variant="body2"
            sx={{ color: "#ffffff", mb: 1, fontFamily: "monospace" }}
          >
            Building... {Math.round(buildProgress)}%
          </Typography>
          <LinearProgress
            variant="determinate"
            value={buildProgress}
            sx={{
              backgroundColor: "rgba(0, 255, 0, 0.1)",
              "& .MuiLinearProgress-bar": {
                backgroundColor: "#00ff00",
              },
            }}
          />
        </Box>
      )}

      <DemoOutput>
        {isRunning && (
          <DemoFrame>
            <iframe
              src={project.demoUrl || "about:blank"}
              title={project.name}
              style={{
                width: "100%",
                height: "100%",
                border: "none",
                borderRadius: "8px",
              }}
            />
          </DemoFrame>
        )}

        {!isRunning && !isBuilding && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: "#666",
              fontFamily: "monospace",
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Click &quot;Run&quot; to start the demo
            </Typography>
            <Typography variant="body2" sx={{ textAlign: "center" }}>
              {project.description}
            </Typography>
            <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
              {project.technologies.map((tech) => (
                <Box
                  key={tech}
                  sx={{
                    padding: "0.25rem 0.5rem",
                    backgroundColor: "rgba(0, 255, 0, 0.1)",
                    border: "1px solid rgba(0, 255, 0, 0.3)",
                    borderRadius: "4px",
                    fontSize: "0.75rem",
                    color: "#00ff00",
                  }}
                >
                  {tech}
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </DemoOutput>

      <ConsoleLogs>
        <Typography
          variant="h6"
          sx={{ color: "#ffffff", mb: 2, fontFamily: "monospace" }}
        >
          Console Output
        </Typography>
        {logs.map((log) => (
          <LogEntry key={log.id} level={log.level}>
            <Typography
              variant="body2"
              sx={{
                color: "#666",
                fontFamily: "monospace",
                fontSize: "0.75rem",
                minWidth: "80px",
              }}
            >
              {log.timestamp.toLocaleTimeString()}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: getLogColor(log.level),
                fontFamily: "monospace",
                fontSize: "0.75rem",
                minWidth: "60px",
                textTransform: "uppercase",
              }}
            >
              {log.level}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#ffffff",
                fontFamily: "monospace",
                fontSize: "0.75rem",
                flex: 1,
              }}
            >
              {log.message}
            </Typography>
            {log.source && (
              <Typography
                variant="body2"
                sx={{
                  color: "#666",
                  fontFamily: "monospace",
                  fontSize: "0.75rem",
                }}
              >
                [{log.source}]
              </Typography>
            )}
          </LogEntry>
        ))}
        <div ref={logsEndRef} />
      </ConsoleLogs>

      <MetricsPanel>
        <Typography
          variant="h6"
          sx={{ color: "#ffffff", mb: 2, fontFamily: "monospace" }}
        >
          Performance Metrics
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 2,
          }}
        >
          <MetricItem>
            <Speed sx={{ color: "#00ff00", fontSize: 20 }} />
            <Box>
              <Typography
                variant="body2"
                sx={{ color: "#ffffff", fontFamily: "monospace" }}
              >
                CPU Usage
              </Typography>
              <Typography
                variant="h6"
                sx={{ color: "#00ff00", fontFamily: "monospace" }}
              >
                {Math.round(metrics.cpu)}%
              </Typography>
            </Box>
          </MetricItem>

          <MetricItem>
            <Memory sx={{ color: "#007acc", fontSize: 20 }} />
            <Box>
              <Typography
                variant="body2"
                sx={{ color: "#ffffff", fontFamily: "monospace" }}
              >
                Memory
              </Typography>
              <Typography
                variant="h6"
                sx={{ color: "#007acc", fontFamily: "monospace" }}
              >
                {Math.round(metrics.memory)}%
              </Typography>
            </Box>
          </MetricItem>

          <MetricItem>
            <NetworkCheck sx={{ color: "#ffbd2e", fontSize: 20 }} />
            <Box>
              <Typography
                variant="body2"
                sx={{ color: "#ffffff", fontFamily: "monospace" }}
              >
                Network
              </Typography>
              <Typography
                variant="h6"
                sx={{ color: "#ffbd2e", fontFamily: "monospace" }}
              >
                {Math.round(metrics.network)}%
              </Typography>
            </Box>
          </MetricItem>

          <MetricItem>
            <Speed sx={{ color: "#ff6b6b", fontSize: 20 }} />
            <Box>
              <Typography
                variant="body2"
                sx={{ color: "#ffffff", fontFamily: "monospace" }}
              >
                Response Time
              </Typography>
              <Typography
                variant="h6"
                sx={{ color: "#ff6b6b", fontFamily: "monospace" }}
              >
                {Math.round(metrics.responseTime)}ms
              </Typography>
            </Box>
          </MetricItem>
        </Box>
      </MetricsPanel>
    </LiveDemoContainer>
  );
};

const getLogColor = (level: LogEntry["level"]): string => {
  switch (level) {
    case "error":
      return "#ff0000";
    case "warn":
      return "#ffbd2e";
    case "success":
      return "#00ff00";
    case "info":
    default:
      return "#007acc";
  }
};

export default LiveDemo;
