"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { CardContent, CardActionArea, Button } from "@mui/material";

import { CardProps } from "./Card.type";
import {
  StyledCardContainer,
  StyledCard,
  StyledCardTitle,
  StyledCardTagline,
  StyledCardDescription,
  StyledCardDate,
  PhotoCardContainer,
  PhotoCardImage,
  PhotoCardContent,
  PhotoCardImageElement,
  AnimatedCard,
  CanvasContainer,
} from "./Card.style";
import { OrbitControls, TorusKnot } from "@react-three/drei";
import { Box } from "@mui/system";

const Card: React.FC<CardProps> = ({
  title,
  tagline,
  description,
  date,
  href,
  icon,
  color,
  buttonText,
  photoUrl,
  photoAlt,
  photoPosition = "left",
  photoSize = "medium",
  animation = "fade",
  gradient = false,
  glow = false,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // Render photo card variant if photoUrl is provided
  if (photoUrl) {
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
          }}
        >
          <CanvasContainer camera={{ position: [0, 0, 2.5], fov: 50 }}>
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
          </CanvasContainer>
        </div>

        <AnimatedCard animation={animation}>
          <StyledCard
            id="styled-card-content"
            gradient={gradient}
            glow={glow}
            style={{
              position: "relative",
              zIndex: 1,
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
                <PhotoCardContainer>
                  {photoUrl && (
                    <PhotoCardImage
                      size={photoSize}
                      photoposition={photoPosition}
                    >
                      <PhotoCardImageElement
                        src={photoUrl}
                        alt={photoAlt || title}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src =
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23e0e0e0'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999' font-family='Arial' font-size='16'%3EPhoto%3C/text%3E%3C/svg%3E";
                        }}
                      />
                    </PhotoCardImage>
                  )}

                  <PhotoCardContent>
                    {/* Icon and Title */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
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
                            flexShrink: 0,
                          }}
                        >
                          {icon}
                        </span>
                      )}
                      <div style={{ flex: 1 }}>
                        {tagline && (
                          <StyledCardTagline variant="body2">
                            {tagline}
                          </StyledCardTagline>
                        )}
                        <StyledCardTitle
                          id="styled-card-title"
                          variant="h6"
                          gutterBottom
                        >
                          {title}
                        </StyledCardTitle>
                      </div>
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
                      <Box style={{ marginTop: 24 }}>
                        <Button
                          aria-label={
                            buttonText ? buttonText : `Go to ${title}`
                          }
                          style={{
                            background: "none",
                            border: `1px solid ${color || "#1976d2"}`,
                            color: color || "#1976d2",
                            padding: "8px 24px",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontWeight: 500,
                            fontSize: 16,
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          {buttonText}
                        </Button>
                      </Box>
                    )}
                  </PhotoCardContent>
                </PhotoCardContainer>
              </CardContent>
            </CardActionArea>
          </StyledCard>
        </AnimatedCard>
      </StyledCardContainer>
    );
  }

  // Render default card variant
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
        }}
      >
        <CanvasContainer camera={{ position: [0, 0, 2.5], fov: 50 }}>
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
        </CanvasContainer>
      </div>
      {/* Card Content */}
      <AnimatedCard animation={animation}>
        <StyledCard
          id="styled-card-content"
          gradient={gradient}
          glow={glow}
          style={{
            position: "relative",
            zIndex: 1,
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
                <div>
                  {tagline && (
                    <StyledCardTagline variant="body2">
                      {tagline}
                    </StyledCardTagline>
                  )}
                  <StyledCardTitle
                    id="styled-card-title"
                    variant="h6"
                    gutterBottom
                  >
                    {title}
                  </StyledCardTitle>
                </div>
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
                <Box style={{ marginTop: 24 }}>
                  <Button
                    aria-label={buttonText ? buttonText : `Go to ${title}`}
                    style={{
                      background: "none",
                      border: `1px solid ${color || "#1976d2"}`,
                      color: color || "#1976d2",
                      padding: "8px 24px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: 500,
                      fontSize: 16,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    {buttonText}
                  </Button>
                </Box>
              )}
            </CardContent>
          </CardActionArea>
        </StyledCard>
      </AnimatedCard>
    </StyledCardContainer>
  );
};

export default Card;
