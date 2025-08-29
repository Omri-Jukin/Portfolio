"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { CardContent, CardActionArea, Button } from "@mui/material";
import Image from "next/image";
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
  AnimatedCard,
} from "./Card.style";
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
              <CardContent sx={{ p: 0 }}>
                <PhotoCardContainer>
                  {photoUrl && (
                    <PhotoCardImage
                      size={photoSize}
                      photoposition={photoPosition}
                    >
                      <Image
                        src={photoUrl}
                        alt={photoAlt || title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          objectPosition: "center",
                          transition: "transform 0.3s ease",
                          display: "block",
                        }}
                        onError={(
                          e: React.SyntheticEvent<HTMLImageElement>
                        ) => {
                          const target = e.target as HTMLImageElement;
                          target.src =
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23e0e0e0'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999' font-family='Arial' font-size='16'%3EPhoto%3C/text%3E%3C/svg%3E";
                        }}
                        onMouseEnter={(
                          e: React.MouseEvent<HTMLImageElement>
                        ) => {
                          e.currentTarget.style.transform = "scale(1.05)";
                        }}
                        onMouseLeave={(
                          e: React.MouseEvent<HTMLImageElement>
                        ) => {
                          e.currentTarget.style.transform = "scale(1)";
                        }}
                      />
                    </PhotoCardImage>
                  )}

                  <PhotoCardContent>
                    {/* Icon and Title */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        marginBottom: 2, // 16px (theme spacing)
                      }}
                    >
                      {icon && (
                        <Box
                          sx={{
                            color: color || "#1976d2",
                            fontSize: 32,
                            display: "flex",
                            alignItems: "center",
                            marginRight: 12,
                            flexShrink: 0,
                          }}
                        >
                          {icon}
                        </Box>
                      )}
                      <Box sx={{ flex: 1 }}>
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
                      </Box>
                    </Box>

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
                      <Box sx={{ marginTop: 24 }}>
                        <Button
                          aria-label={
                            buttonText ? buttonText : `Go to ${title}`
                          }
                          sx={{
                            background: "none",
                            border: `2px solid ${color || "#4ECDC4"}`,
                            color: color || "#4ECDC4",
                            padding: "10px 28px",
                            borderRadius: "12px",
                            cursor: "pointer",
                            fontWeight: 600,
                            fontSize: 16,
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            transition: "all 0.3s ease-in-out",
                            boxShadow: `0 2px 4px ${color || "#4ECDC4"}20`,
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
      {/* 3D Background Animation - Commented out for now */}
      {/* <div
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
      </div> */}
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
            <CardContent sx={{ p: 0 }}>
              {/* Icon and Title */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                {icon && (
                  <Box
                    sx={{
                      color: color || "#4ECDC4",
                      fontSize: 32,
                      display: "flex",
                      alignItems: "center",
                      marginRight: 12,
                      filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))",
                    }}
                  >
                    {icon}
                  </Box>
                )}
                <Box sx={{ flex: 1 }}>
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
                </Box>
              </Box>
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
                <Box sx={{ marginTop: 24 }}>
                  <Button
                    aria-label={buttonText ? buttonText : `Go to ${title}`}
                    sx={{
                      background: "none",
                      border: `2px solid ${color || "#4ECDC4"}`,
                      color: color || "#4ECDC4",
                      padding: "10px 28px",
                      borderRadius: "12px",
                      cursor: "pointer",
                      fontWeight: 600,
                      fontSize: 16,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      transition: "all 0.3s ease-in-out",
                      boxShadow: `0 2px 4px ${color || "#4ECDC4"}20`,
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
