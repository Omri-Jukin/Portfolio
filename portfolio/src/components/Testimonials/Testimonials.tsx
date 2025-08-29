import React, { useEffect, useState, useRef } from "react";
import {
  TestimonialsAuthor,
  TestimonialsCompany,
  TestimonialsContainer,
  TestimonialsQuote,
  TestimonialsRole,
  TestimonialCard,
  TestimonialsWrapper,
  SectionTitle,
  RollingContainer,
  TestimonialItem,
} from "./Testimonials.style";
import { testimonials } from "./testimonials.const";

export default function Testimonials() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const animate = () => {
      setScrollPosition((prev) => {
        const newPosition = prev + 1;
        // Reset position when we've scrolled through all testimonials
        if (newPosition >= testimonials.length * 400) {
          return 0;
        }
        return newPosition;
      });
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Duplicate testimonials for seamless infinite scroll
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <TestimonialsWrapper>
      <SectionTitle>What People Say</SectionTitle>
      <TestimonialsContainer>
        <RollingContainer
          ref={containerRef}
          style={{
            transform: `translateX(-${scrollPosition}px)`,
          }}
        >
          {duplicatedTestimonials.map((testimonial, index) => (
            <TestimonialItem key={`${testimonial.author}-${index}`}>
              <TestimonialCard>
                <TestimonialsQuote>
                  &quot;{testimonial.quote}&quot;
                </TestimonialsQuote>
                <TestimonialsAuthor>— {testimonial.author}</TestimonialsAuthor>
                <TestimonialsRole>{testimonial.role}</TestimonialsRole>
                <TestimonialsCompany>{testimonial.company}</TestimonialsCompany>
              </TestimonialCard>
            </TestimonialItem>
          ))}
        </RollingContainer>
      </TestimonialsContainer>
    </TestimonialsWrapper>
  );
}
