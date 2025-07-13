"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { CardContent, CardActionArea, Fade } from "@mui/material";
import { CardProps } from "./Card.types";
import {
  StyledCardContainer,
  StyledCard,
  StyledCardTitle,
  StyledCardDescription,
  StyledCardDate,
} from "./Card.styled";

const Card: React.FC<CardProps> = ({ title, description, date, href }) => {
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
    <StyledCardContainer ref={cardRef}>
      <Fade in={isVisible} timeout={600}>
        <StyledCard>
          <CardActionArea
            component={Link}
            href={href}
            sx={{
              p: 3,
              display: "block",
              textAlign: "start",
            }}
          >
            <CardContent sx={{ p: 0 }}>
              <StyledCardTitle variant="h6" gutterBottom>
                {title}
              </StyledCardTitle>

              {description && (
                <StyledCardDescription variant="body2" color="text.secondary">
                  {description}
                </StyledCardDescription>
              )}

              {date && (
                <StyledCardDate variant="caption" color="text.secondary">
                  {date}
                </StyledCardDate>
              )}
            </CardContent>
          </CardActionArea>
        </StyledCard>
      </Fade>
    </StyledCardContainer>
  );
};

export default Card;
