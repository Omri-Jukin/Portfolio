import { ModelType } from "./PathSelection3DCard.type";

/**
 * Default model URLs based on type
 */
export const MODEL_URLS: Record<ModelType, string> = {
  horse: "/models/horse_head_1k.gltf/horse_head_1k.gltf",
  lion: "/models/lion_head_1k.gltf/lion_head_1k.gltf",
  bull: "/models/bull_head_1k.gltf/bull_head_1k.gltf",
};

/**
 * Default colors for each model type
 */
export const MODEL_COLORS: Record<ModelType, string> = {
  horse: "#10B981", // Green
  lion: "#9333EA", // Purple
  bull: "#2563EB", // Blue
};

/**
 * Default background colors for each variant
 */
export const BACKGROUND_COLORS = {
  glassmorphism: "rgba(255, 255, 255, 0.1)",
  gradient:
    "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 100%)",
  solid: "rgba(255, 255, 255, 0.15)",
  neon: "rgba(0, 255, 255, 0.2)",
  holographic:
    "linear-gradient(135deg, rgba(255,0,150,0.3) 0%, rgba(0,255,255,0.3) 50%, rgba(255,200,0,0.3) 100%)",
  metal:
    "linear-gradient(135deg, rgba(200,200,200,0.3) 0%, rgba(100,100,100,0.3) 100%)",
  glow: "rgba(255, 255, 255, 0.2)",
};

/**
 * Default animation values
 */
export const DEFAULT_ANIMATION = {
  rotation: 0,
  rotationSpeed: 1,
  floatSpeed: 1,
  floatAmplitude: 0.5,
  hoverScaleAmount: 1.1,
  glowIntensity: 0.8,
  modelRotationSpeed: 0.5,
  animationDelay: 0,
  hoverEffectIntensity: 1,
};

/**
 * Default hover effect
 */
export const DEFAULT_HOVER_EFFECT = "glow" as const;
