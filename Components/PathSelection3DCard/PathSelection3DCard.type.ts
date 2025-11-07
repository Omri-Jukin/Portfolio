export type ModelType = "horse" | "lion" | "bull";

export type BackgroundVariant =
  | "glassmorphism"
  | "gradient"
  | "solid"
  | "neon"
  | "holographic"
  | "metal"
  | "glow";

export type HoverEffect =
  | "none"
  | "neon"
  | "particles"
  | "scale"
  | "glow"
  | "pulse"
  | "shake"
  | "rotate"
  | "explode"
  | "magnetic";

export interface PathSelection3DCardProps {
  /**
   * Model type to display (horse, lion, or bull)
   */
  type: ModelType;

  /**
   * Rotation state in degrees (0-360)
   * Controls the initial rotation of the card
   */
  rotation?: number;

  /**
   * Rotation speed multiplier (0 = no rotation, 1 = normal speed, 2 = 2x speed)
   * Controls how fast the card rotates
   */
  rotationSpeed?: number;

  /**
   * Background variant style
   * - glassmorphism: Glass effect with blur
   * - gradient: Gradient background
   * - solid: Solid color background
   * - neon: Neon glow effect
   * - holographic: Holographic/rainbow effect
   * - metal: Metallic appearance
   * - glow: Soft glow effect
   */
  backgroundVariant?: BackgroundVariant;

  /**
   * Background color (hex, rgb, or rgba)
   * Used as base color for background variants
   */
  backgroundColor?: string;

  /**
   * Animation direction in degrees (0-360)
   * Controls where the animation is looking/facing
   * 0 = right, 90 = down, 180 = left, 270 = up
   */
  animationDirection?: number;

  /**
   * Position in 3D space [x, y, z]
   */
  position?: [number, number, number];

  /**
   * Scale of the card [x, y, z]
   */
  scale?: [number, number, number] | number;

  /**
   * Enable floating animation
   */
  floating?: boolean;

  /**
   * Floating animation speed (higher = faster)
   */
  floatSpeed?: number;

  /**
   * Floating animation amplitude (how much it moves up/down)
   */
  floatAmplitude?: number;

  /**
   * Enable rotation animation
   */
  autoRotate?: boolean;

  /**
   * Rotation axis: 'x' | 'y' | 'z' | 'all'
   */
  rotationAxis?: "x" | "y" | "z" | "all";

  /**
   * Enable hover scale effect
   */
  hoverScale?: boolean;

  /**
   * Hover scale multiplier (1.1 = 10% larger on hover)
   */
  hoverScaleAmount?: number;

  /**
   * Enable glow effect on hover
   */
  hoverGlow?: boolean;

  /**
   * Glow intensity on hover (0-1)
   */
  glowIntensity?: number;

  /**
   * Hover effect type
   * - none: No hover effect
   * - neon: Neon glow effect
   * - particles: Particle burst effect
   * - scale: Scale up animation
   * - glow: Soft glow effect
   * - pulse: Pulsing animation
   * - shake: Shake animation
   * - rotate: Rotation speed increase
   * - explode: Explosion-like particles
   * - magnetic: Magnetic pull effect
   */
  hoverEffect?: HoverEffect;

  /**
   * Hover effect intensity (0-1)
   * Controls how strong the hover effect is
   */
  hoverEffectIntensity?: number;

  /**
   * Click handler
   */
  onClick?: () => void;

  /**
   * Custom model URL (overrides default based on type)
   */
  modelUrl?: string;

  /**
   * Model scale (separate from card scale)
   */
  modelScale?: [number, number, number] | number;

  /**
   * Model position offset [x, y, z]
   */
  modelPosition?: [number, number, number];

  /**
   * Model rotation speed (separate from card rotation)
   */
  modelRotationSpeed?: number;

  /**
   * Model rotation axis
   */
  modelRotationAxis?: "x" | "y" | "z" | "all";

  /**
   * Enable particle effects around card
   */
  particles?: boolean;

  /**
   * Particle count
   */
  particleCount?: number;

  /**
   * Animation delay in seconds
   */
  animationDelay?: number;

  /**
   * Custom className
   */
  className?: string;
}
