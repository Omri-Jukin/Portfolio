"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { CardContent, CardActionArea, Fade } from "@mui/material";
import { CardProps } from "./Card.type";
import {
  StyledCardContainer,
  StyledCard,
  StyledCardTitle,
  StyledCardDescription,
  StyledCardDate,
} from "./Card.style";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, TorusKnot } from "@react-three/drei";

const Card: React.FC<CardProps> = ({
  title,
  description,
  date,
  href,
  icon,
  color,
  buttonText,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <StyledCardContainer
      id="styled-card-container"
      ref={cardRef}
      style={{ position: "relative", overflow: "hidden" }}
    >
      {/* 3D Background Animation */}
      <div
        id="styled-card-3d-background"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
          pointerEvents: "none",
          border: "10px solid red", // DEBUG: make the canvas container visible
          background: "rgba(0,255,0,0.1)", // DEBUG: add a faint green background
        }}
      >
        <Canvas
          camera={{ position: [0, 0, 2.5], fov: 50 }}
          style={{ background: "transparent" }}
        >
          <ambientLight intensity={1} />
          <directionalLight
            position={[2, 2, 2]}
            intensity={1}
            color={"#00bcd4"}
          />
          <TorusKnot args={[0.7, 0.25, 100, 16]}>
            <meshStandardMaterial
              color={"#00bcd4"}
              transparent
              opacity={0.85}
            />
          </TorusKnot>
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={2}
          />
        </Canvas>
      </div>
      {/* Card Content */}
      <Fade in={isVisible} timeout={600}>
        <StyledCard
          id="styled-card-content"
          style={{
            position: "relative",
            zIndex: 1,
            background: "rgba(255,255,255,0.85)",
          }}
        >
          <CardActionArea
            id="styled-card-action-area"
            component={Link}
            href={href}
            aria-label={`Go to ${title}`}
            sx={{
              p: 3,
              display: "block",
              textAlign: "start",
            }}
          >
            <CardContent id="styled-card-content" sx={{ p: 0 }}>
              {/* Icon and Title */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                {icon && (
                  <span
                    style={{
                      color: color || "#1976d2",
                      fontSize: 32,
                      display: "flex",
                      alignItems: "center",
                      marginRight: 12,
                    }}
                  >
                    {icon}
                  </span>
                )}
                <StyledCardTitle
                  id="styled-card-title"
                  variant="h6"
                  gutterBottom
                >
                  {title}
                </StyledCardTitle>
              </div>
              {description && (
                <StyledCardDescription
                  id="styled-card-description"
                  variant="body2"
                  color="text.secondary"
                >
                  {description}
                </StyledCardDescription>
              )}
              {date && (
                <StyledCardDate
                  id="styled-card-date"
                  variant="caption"
                  color="text.secondary"
                >
                  {date}
                </StyledCardDate>
              )}
              {/* Button */}
              {buttonText && (
                <div style={{ marginTop: 24 }}>
                  <button
                    aria-label={buttonText ? buttonText : `Go to ${title}`}
                    style={{
                      background: "none",
                      border: `1px solid ${color || "#1976d2"}`,
                      color: color || "#1976d2",
                      padding: "8px 24px",
                      borderRadius: 6,
                      cursor: "pointer",
                      fontWeight: 500,
                      fontSize: 16,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    {buttonText}
                  </button>
                </div>
              )}
            </CardContent>
          </CardActionArea>
        </StyledCard>
      </Fade>
    </StyledCardContainer>
  );
};

export default Card;
