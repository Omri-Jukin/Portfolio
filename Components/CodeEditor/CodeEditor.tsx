"use client";

import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import {
  CodeEditorContainer,
  CodeEditorHeader,
  CodeEditorTabs,
  CodeEditorTab,
  CodeEditorContent,
  CodeLine,
  LineNumber,
  CodeText,
  SyntaxHighlight,
} from "./CodeEditor.style";

interface CodeEditorProps {
  files: CodeFile[];
  activeFile?: string;
  onFileChange?: (fileId: string) => void;
  showLineNumbers?: boolean;
  className?: string;
}

interface CodeFile {
  id: string;
  name: string;
  language: string;
  content: string;
  isModified?: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  files,
  activeFile,
  onFileChange,
  showLineNumbers = true,
  className,
}) => {
  const [currentFile, setCurrentFile] = useState(activeFile || files[0]?.id);
  const [isTyping, setIsTyping] = useState(false);
  const [currentLine, setCurrentLine] = useState(0);

  const activeFileData = files.find((file) => file.id === currentFile);

  // Auto-type effect for code content
  useEffect(() => {
    if (!activeFileData) return;

    setIsTyping(true);
    setCurrentLine(0);

    const lines = activeFileData.content.split("\n");
    const typeInterval = setInterval(() => {
      setCurrentLine((prev) => {
        if (prev >= lines.length) {
          setIsTyping(false);
          clearInterval(typeInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 100);

    return () => clearInterval(typeInterval);
  }, [activeFileData]);

  const handleFileClick = (fileId: string) => {
    setCurrentFile(fileId);
    onFileChange?.(fileId);
  };

  const renderCodeLine = (line: string, index: number) => {
    const isVisible = index <= currentLine;
    const isCurrentLine = index === currentLine && isTyping;

    return (
      <CodeLine key={index} isVisible={isVisible} isCurrentLine={isCurrentLine}>
        {showLineNumbers && <LineNumber>{index + 1}</LineNumber>}
        <CodeText>
          <SyntaxHighlight language={activeFileData?.language || "typescript"}>
            {line}
          </SyntaxHighlight>
          {isCurrentLine && <span className="cursor">|</span>}
        </CodeText>
      </CodeLine>
    );
  };

  if (!activeFileData) {
    return (
      <CodeEditorContainer className={className}>
        <CodeEditorContent>
          <Typography
            variant="body2"
            sx={{ color: "#666", fontFamily: "monospace" }}
          >
            No file selected
          </Typography>
        </CodeEditorContent>
      </CodeEditorContainer>
    );
  }

  const lines = activeFileData.content.split("\n");

  return (
    <CodeEditorContainer className={className}>
      <CodeEditorHeader>
        <CodeEditorTabs>
          {files.map((file) => (
            <CodeEditorTab
              key={file.id}
              active={currentFile === file.id}
              onClick={() => handleFileClick(file.id)}
            >
              <span style={{ marginRight: "8px" }}>
                {getFileIcon(file.language)}
              </span>
              {file.name}
              {file.isModified && (
                <span style={{ marginLeft: "8px", color: "#ffbd2e" }}>●</span>
              )}
            </CodeEditorTab>
          ))}
        </CodeEditorTabs>
      </CodeEditorHeader>

      <CodeEditorContent>
        {lines.map((line, index) => renderCodeLine(line, index))}
      </CodeEditorContent>
    </CodeEditorContainer>
  );
};

// Helper function to get file icons based on language
const getFileIcon = (language: string): string => {
  const icons: Record<string, string> = {
    typescript: "📘",
    javascript: "📗",
    react: "⚛️",
    json: "📄",
    markdown: "📝",
    css: "🎨",
    html: "🌐",
    python: "🐍",
    java: "☕",
    csharp: "🔷",
    go: "🐹",
    rust: "🦀",
    sql: "🗄️",
    yaml: "⚙️",
    xml: "📋",
    default: "📄",
  };

  return icons[language.toLowerCase()] || icons.default;
};

export default CodeEditor;
