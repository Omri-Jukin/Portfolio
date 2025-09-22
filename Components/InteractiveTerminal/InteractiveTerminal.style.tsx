import styled from "@emotion/styled";
import { Box, Typography, TextField, Button } from "@mui/material";

export const TerminalContainer = styled(Box)`
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #0d1117 0%, #161b22 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
        circle at 20% 80%,
        rgba(0, 255, 0, 0.1) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 80% 20%,
        rgba(0, 122, 204, 0.1) 0%,
        transparent 50%
      );
    pointer-events: none;
  }
`;

export const TerminalWindow = styled(Box)`
  width: 100%;
  max-width: 1200px;
  background: #0d1117;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(0, 255, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  overflow: hidden;
  position: relative;
`;

export const TerminalHeader = styled(Box)`
  background: linear-gradient(180deg, #21262d 0%, #161b22 100%);
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(0, 255, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const TerminalTabs = styled(Box)`
  display: flex;
  background: #161b22;
  border-bottom: 1px solid rgba(0, 255, 0, 0.2);
`;

export const TerminalTab = styled(Box)<{ active: boolean }>`
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  border-bottom: 2px solid
    ${(props) => (props.active ? "#00ff00" : "transparent")};
  color: ${(props) => (props.active ? "#00ff00" : "#ffffff")};
  font-family: "JetBrains Mono", "Fira Code", "Consolas", monospace;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;

  &:hover {
    background: rgba(0, 255, 0, 0.1);
    color: #00ff00;
  }
`;

export const TerminalBody = styled(Box)`
  padding: 2rem;
  min-height: 600px;
  background: #0d1117;
  font-family: "JetBrains Mono", "Fira Code", "Consolas", monospace;
  overflow-y: auto;
  max-height: 80vh;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #161b22;
  }

  &::-webkit-scrollbar-thumb {
    background: #00ff00;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #00cc00;
  }
`;

export const TerminalLine = styled(Box)<{ type?: string }>`
  margin-bottom: 0.5rem;
  line-height: 1.6;
  opacity: ${(props) => (props.type === "error" ? 0.8 : 1)};
`;

export const TerminalPrompt = styled(Typography)`
  color: #00ff00;
  font-family: "JetBrains Mono", "Fira Code", "Consolas", monospace;
  font-size: 0.875rem;
  display: inline;
  margin-right: 0.5rem;
`;

export const TerminalCursor = styled.span`
  display: inline-block;
  width: 8px;
  height: 16px;
  background-color: #00ff00;
  animation: blink 1s infinite;
  margin-left: 2px;

  @keyframes blink {
    0%,
    50% {
      opacity: 1;
    }
    51%,
    100% {
      opacity: 0;
    }
  }
`;

export const TerminalInput = styled(TextField)`
  flex: 1;
  margin-left: 0.5rem;

  .MuiInputBase-input {
    color: #ffffff;
    font-family: "JetBrains Mono", "Fira Code", "Consolas", monospace;
    font-size: 0.875rem;
    background: transparent;
    border: none;
    outline: none;
    padding: 0;
  }

  .MuiInputBase-root {
    background: transparent;
    border: none;
    box-shadow: none;
  }

  .MuiInputBase-root:before {
    border: none;
  }

  .MuiInputBase-root:after {
    border: none;
  }

  .MuiInputBase-root:hover:not(.Mui-disabled):before {
    border: none;
  }
`;

export const CommandButton = styled(Button)`
  font-family: "JetBrains Mono", "Fira Code", "Consolas", monospace;
  font-size: 0.75rem;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  text-transform: none;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 255, 0, 0.3);
  }
`;

export const StatusIndicator = styled(Box)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(0, 255, 0, 0.05);
  border: 1px solid rgba(0, 255, 0, 0.2);
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(0, 255, 0, 0.1);
    transform: translateY(-1px);
  }
`;

export const CodeBlock = styled(Box)`
  background: #161b22;
  border: 1px solid rgba(0, 255, 0, 0.2);
  border-radius: 6px;
  padding: 1rem;
  margin: 1rem 0;
  font-family: "JetBrains Mono", "Fira Code", "Consolas", monospace;
  overflow-x: auto;

  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #0d1117;
  }

  &::-webkit-scrollbar-thumb {
    background: #00ff00;
    border-radius: 3px;
  }
`;

// Animation keyframes
export const fadeIn = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

export const typewriter = `
  @keyframes typewriter {
    from { width: 0; }
    to { width: 100%; }
  }
`;

export const blink = `
  @keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
  }
`;

// Additional terminal-specific styles
export const TerminalGlow = styled(Box)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    45deg,
    transparent 30%,
    rgba(0, 255, 0, 0.05) 50%,
    transparent 70%
  );
  pointer-events: none;
  animation: scan 3s linear infinite;

  @keyframes scan {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
`;

export const TerminalNoise = styled(Box)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: radial-gradient(
    circle at 1px 1px,
    rgba(0, 255, 0, 0.1) 1px,
    transparent 0
  );
  background-size: 20px 20px;
  pointer-events: none;
  opacity: 0.3;
  animation: noise 0.2s infinite;

  @keyframes noise {
    0% {
      transform: translate(0, 0);
    }
    10% {
      transform: translate(-1px, -1px);
    }
    20% {
      transform: translate(1px, -1px);
    }
    30% {
      transform: translate(-1px, 1px);
    }
    40% {
      transform: translate(1px, 1px);
    }
    50% {
      transform: translate(-1px, -1px);
    }
    60% {
      transform: translate(1px, -1px);
    }
    70% {
      transform: translate(-1px, 1px);
    }
    80% {
      transform: translate(1px, 1px);
    }
    90% {
      transform: translate(-1px, -1px);
    }
    100% {
      transform: translate(0, 0);
    }
  }
`;
