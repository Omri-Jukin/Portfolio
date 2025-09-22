import styled from "@emotion/styled";
import { Box, Typography } from "@mui/material";

export const CodeEditorContainer = styled(Box)`
  width: 100%;
  background: #0d1117;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(0, 255, 0, 0.1);
  font-family: "JetBrains Mono", "Fira Code", "Consolas", monospace;
`;

export const CodeEditorHeader = styled(Box)`
  background: #161b22;
  border-bottom: 1px solid rgba(0, 255, 0, 0.2);
  padding: 0.5rem 0;
`;

export const CodeEditorTabs = styled(Box)`
  display: flex;
  overflow-x: auto;
  padding: 0 1rem;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-track {
    background: #0d1117;
  }

  &::-webkit-scrollbar-thumb {
    background: #00ff00;
    border-radius: 2px;
  }
`;

export const CodeEditorTab = styled(Box)<{ active: boolean }>`
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-bottom: 2px solid
    ${(props) => (props.active ? "#00ff00" : "transparent")};
  color: ${(props) => (props.active ? "#00ff00" : "#ffffff")};
  font-size: 0.875rem;
  white-space: nowrap;
  transition: all 0.2s ease;
  min-width: fit-content;

  &:hover {
    background: rgba(0, 255, 0, 0.1);
    color: #00ff00;
  }
`;

export const CodeEditorContent = styled(Box)`
  background: #0d1117;
  padding: 1rem;
  overflow-x: auto;
  max-height: 500px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
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

export const CodeLine = styled(Box)<{
  isVisible: boolean;
  isCurrentLine: boolean;
}>`
  display: flex;
  align-items: center;
  min-height: 1.5rem;
  opacity: ${(props) => (props.isVisible ? 1 : 0.3)};
  background: ${(props) =>
    props.isCurrentLine ? "rgba(0, 255, 0, 0.1)" : "transparent"};
  transition: all 0.3s ease;
  padding: 0.25rem 0;
`;

export const LineNumber = styled(Typography)`
  color: #666;
  font-size: 0.875rem;
  min-width: 3rem;
  text-align: right;
  margin-right: 1rem;
  user-select: none;
  font-family: "JetBrains Mono", "Fira Code", "Consolas", monospace;
`;

export const CodeText = styled(Box)`
  flex: 1;
  color: #ffffff;
  font-size: 0.875rem;
  line-height: 1.5;
  font-family: "JetBrains Mono", "Fira Code", "Consolas", monospace;

  .cursor {
    color: #00ff00;
    animation: blink 1s infinite;
  }

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

export const SyntaxHighlight = styled.span<{ language: string }>`
  color: #ffffff;

  /* TypeScript/JavaScript syntax highlighting */
  .keyword {
    color: #c678dd;
  }

  .string {
    color: #98c379;
  }

  .number {
    color: #d19a66;
  }

  .comment {
    color: #5c6370;
    font-style: italic;
  }

  .function {
    color: #61dafb;
  }

  .variable {
    color: #e06c75;
  }

  .operator {
    color: #56b6c2;
  }

  .punctuation {
    color: #abb2bf;
  }

  .class {
    color: #e5c07b;
  }

  .interface {
    color: #e5c07b;
  }

  .type {
    color: #e5c07b;
  }

  .import {
    color: #c678dd;
  }

  .export {
    color: #c678dd;
  }

  .const {
    color: #c678dd;
  }

  .let {
    color: #c678dd;
  }

  .var {
    color: #c678dd;
  }

  .if {
    color: #c678dd;
  }

  .else {
    color: #c678dd;
  }

  .for {
    color: #c678dd;
  }

  .while {
    color: #c678dd;
  }

  .return {
    color: #c678dd;
  }

  .true {
    color: #98c379;
  }

  .false {
    color: #98c379;
  }

  .null {
    color: #98c379;
  }

  .undefined {
    color: #98c379;
  }
`;

// Additional code editor styles
export const CodeEditorMinimap = styled(Box)`
  position: absolute;
  right: 0;
  top: 0;
  width: 100px;
  height: 100%;
  background: #161b22;
  border-left: 1px solid rgba(0, 255, 0, 0.2);
  opacity: 0.7;
`;

export const CodeEditorStatusBar = styled(Box)`
  background: #161b22;
  border-top: 1px solid rgba(0, 255, 0, 0.2);
  padding: 0.5rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  color: #666;
`;

export const CodeEditorBreadcrumb = styled(Box)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-size: 0.75rem;

  .separator {
    color: #999;
  }

  .current {
    color: #00ff00;
  }
`;

export const CodeEditorGutter = styled(Box)`
  background: #161b22;
  border-right: 1px solid rgba(0, 255, 0, 0.2);
  padding: 1rem 0.5rem;
  min-width: 3rem;
  text-align: center;
  font-size: 0.75rem;
  color: #666;
  user-select: none;
`;

export const CodeEditorLineHighlight = styled(Box)`
  position: absolute;
  left: 0;
  right: 0;
  height: 1.5rem;
  background: rgba(0, 255, 0, 0.1);
  border-left: 3px solid #00ff00;
  pointer-events: none;
`;

export const CodeEditorSelection = styled(Box)`
  position: absolute;
  background: rgba(0, 122, 204, 0.3);
  pointer-events: none;
`;

export const CodeEditorCursor = styled(Box)`
  position: absolute;
  width: 2px;
  height: 1.5rem;
  background: #00ff00;
  animation: blink 1s infinite;
  pointer-events: none;

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
