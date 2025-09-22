import styled from "@emotion/styled";
import { Box, Typography, IconButton } from "@mui/material";

export const LiveDemoContainer = styled(Box)`
  width: 100%;
  background: #0d1117;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(0, 255, 0, 0.2);
  font-family: "JetBrains Mono", "Fira Code", "Consolas", monospace;
`;

export const DemoHeader = styled(Box)`
  background: #161b22;
  border-bottom: 1px solid rgba(0, 255, 0, 0.2);
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const DemoControls = styled(Box)`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

export const DemoOutput = styled(Box)`
  height: 400px;
  background: #0d1117;
  border-bottom: 1px solid rgba(0, 255, 0, 0.2);
  position: relative;
  overflow: hidden;
`;

export const DemoFrame = styled(Box)`
  width: 100%;
  height: 100%;
  background: #ffffff;
  border-radius: 8px;
  margin: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
`;

export const ConsoleLogs = styled(Box)`
  background: #161b22;
  border-bottom: 1px solid rgba(0, 255, 0, 0.2);
  padding: 1rem 1.5rem;
  max-height: 200px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #0d1117;
  }

  &::-webkit-scrollbar-thumb {
    background: #00ff00;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #00cc00;
  }
`;

export const LogEntry = styled(Box)<{ level: string }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(0, 255, 0, 0.1);

  &:last-child {
    border-bottom: none;
  }
`;

export const MetricsPanel = styled(Box)`
  background: #161b22;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(0, 255, 0, 0.2);
`;

export const MetricItem = styled(Box)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: rgba(0, 255, 0, 0.05);
  border: 1px solid rgba(0, 255, 0, 0.2);
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(0, 255, 0, 0.1);
    transform: translateY(-1px);
  }
`;

// Animation keyframes
export const pulse = `
  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }
`;

export const fadeIn = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

export const slideIn = `
  @keyframes slideIn {
    from { transform: translateX(-100%); }
    to { transform: translateX(0); }
  }
`;

export const glow = `
  @keyframes glow {
    0% { box-shadow: 0 0 5px rgba(0, 255, 0, 0.5); }
    50% { box-shadow: 0 0 20px rgba(0, 255, 0, 0.8); }
    100% { box-shadow: 0 0 5px rgba(0, 255, 0, 0.5); }
  }
`;

// Additional demo-specific styles
export const DemoStatusIndicator = styled(Box)<{ status: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${(props) => {
    switch (props.status) {
      case "running":
        return "#00ff00";
      case "building":
        return "#ffbd2e";
      case "error":
        return "#ff0000";
      default:
        return "#666";
    }
  }};
  animation: ${(props) =>
    props.status === "running" ? "pulse 2s infinite" : "none"};
`;

export const DemoProgressBar = styled(Box)`
  width: 100%;
  height: 4px;
  background: rgba(0, 255, 0, 0.1);
  border-radius: 2px;
  overflow: hidden;
  margin-top: 0.5rem;
`;

export const DemoProgressFill = styled(Box)<{ progress: number }>`
  width: ${(props) => props.progress}%;
  height: 100%;
  background: linear-gradient(90deg, #00ff00, #00cc00);
  border-radius: 2px;
  transition: width 0.3s ease;
`;

export const DemoButton = styled(IconButton)<{ variant: string }>`
  color: ${(props) => {
    switch (props.variant) {
      case "run":
        return "#00ff00";
      case "stop":
        return "#ff0000";
      case "restart":
        return "#007acc";
      case "debug":
        return "#ffbd2e";
      default:
        return "#ffffff";
    }
  }};

  &:hover {
    background: rgba(0, 255, 0, 0.1);
    transform: scale(1.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const DemoLogLevel = styled(Typography)<{ level: string }>`
  color: ${(props) => {
    switch (props.level) {
      case "error":
        return "#ff0000";
      case "warn":
        return "#ffbd2e";
      case "success":
        return "#00ff00";
      case "info":
        return "#007acc";
      default:
        return "#ffffff";
    }
  }};
  font-weight: bold;
  text-transform: uppercase;
  font-size: 0.75rem;
  min-width: 60px;
`;

export const DemoMetricValue = styled(Typography)<{ color: string }>`
  color: ${(props) => props.color};
  font-family: "JetBrains Mono", "Fira Code", "Consolas", monospace;
  font-weight: bold;
  font-size: 1.25rem;
`;

export const DemoMetricLabel = styled(Typography)`
  color: #ffffff;
  font-family: "JetBrains Mono", "Fira Code", "Consolas", monospace;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
`;

export const DemoFrameContainer = styled(Box)`
  position: relative;
  width: 100%;
  height: 100%;
  background: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 30px;
    background: #f0f0f0;
    border-bottom: 1px solid #ddd;
    display: flex;
    align-items: center;
    padding: 0 1rem;
  }

  &::after {
    content: "● ● ●";
    position: absolute;
    top: 8px;
    left: 12px;
    color: #999;
    font-size: 12px;
  }
`;

export const DemoLoadingSpinner = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #00ff00;
  font-family: "JetBrains Mono", "Fira Code", "Consolas", monospace;

  &::after {
    content: "Loading...";
    animation: pulse 1.5s infinite;
  }
`;

export const DemoErrorState = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #ff0000;
  font-family: "JetBrains Mono", "Fira Code", "Consolas", monospace;
  text-align: center;
  padding: 2rem;
`;

export const DemoSuccessState = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #00ff00;
  font-family: "JetBrains Mono", "Fira Code", "Consolas", monospace;
  text-align: center;
  padding: 2rem;
`;
