import { useEffect, useRef, useState } from "react";

interface EyeProps {
  className?: string;
  isRightEye?: boolean;
}

export function Eye({ className = "", isRightEye = false }: EyeProps) {
  const eyeRef = useRef<HTMLDivElement>(null);
  const pupilRef = useRef<HTMLDivElement>(null);
  const [pupilPosition, setPupilPosition] = useState({ x: 0, y: 0 });

  // Set default positions based on the original design
  // In SVG, coordinates are from top-left (0,0)
  // The eye is 204x204, so center is at (102, 102)
  // Calculate offset from center
  const defaultPosition = isRightEye
    ? { x: 119.032 - 102, y: 117.787 - 102 } // Right eye pupil
    : { x: 74.8272 - 102, y: 78.3184 - 102 }; // Left eye pupil

  useEffect(() => {
    setPupilPosition({ x: defaultPosition.x, y: defaultPosition.y });
  }, [defaultPosition.x, defaultPosition.y]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!eyeRef.current) return;

      // Get eye position and dimensions
      const eye = eyeRef.current;
      const eyeRect = eye.getBoundingClientRect();
      const eyeCenterX = eyeRect.left + eyeRect.width / 2;
      const eyeCenterY = eyeRect.top + eyeRect.height / 2;

      // Calculate direction vector from eye to mouse
      const dx = e.clientX - eyeCenterX;
      const dy = e.clientY - eyeCenterY;

      // Calculate the distance from eye center to mouse
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Calculate the eye radius and max pupil movement (eye radius minus pupil radius)
      const eyeRadius = eyeRect.width / 2;
      const pupilRadius = 38; // Half of the pupil size (76px/2)
      const maxMovement = eyeRadius - pupilRadius - 5; // Buffer of 5px to ensure pupil stays inside

      // If distance is very small, return to default position
      if (distance < 1) {
        setPupilPosition({ x: defaultPosition.x, y: defaultPosition.y });
        return;
      }

      // Normalize the direction vector
      const nx = dx / distance;
      const ny = dy / distance;

      // Apply the max movement constraint
      let moveX = Math.min(distance, maxMovement) * nx;
      let moveY = Math.min(distance, maxMovement) * ny;

      // Add the initial offset to maintain the design's character
      moveX += defaultPosition.x;
      moveY += defaultPosition.y;

      // Additional constraint check to ensure pupil stays inside eye
      const totalDistance = Math.sqrt(
        Math.pow(moveX - defaultPosition.x, 2) +
          Math.pow(moveY - defaultPosition.y, 2)
      );

      if (totalDistance > maxMovement) {
        const scale = maxMovement / totalDistance;
        moveX = defaultPosition.x + (moveX - defaultPosition.x) * scale;
        moveY = defaultPosition.y + (moveY - defaultPosition.y) * scale;
      }

      setPupilPosition({ x: moveX, y: moveY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [defaultPosition.x, defaultPosition.y]);

  useEffect(() => {
    if (pupilRef.current) {
      pupilRef.current.style.setProperty(
        "transform",
        `translate(-50%, -50%) translate(${pupilPosition.x}px, ${pupilPosition.y}px)`
      );
    }
  }, [pupilPosition]);

  return (
    <div
      ref={eyeRef}
      className={`relative shrink-0 size-[204px] rounded-full bg-[var(--cream-background)] overflow-hidden ${className}`}
      data-name="eye"
    >
      {/* Pupil */}
      <div
        ref={pupilRef}
        className="absolute bg-black rounded-full size-[76px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        id="Pupil"
      />
    </div>
  );
}
