// DNA Helix configuration constants
export const DNA_CONFIG = {
  STRANDS: 2,
  BASE_PAIRS: 20,
  RADIUS: 2,
  HEIGHT: 10,
  ROTATION_SPEED: 0.01,
  WAVE_FREQUENCY: 0.5,
  WAVE_AMPLITUDE: 0.3,
} as const;

// Material properties for DNA strands
export const DNA_MATERIALS = {
  STRAND_1: {
    color: "#00BFFF",
    emissive: "#00BFFF",
    emissiveIntensity: 0.8,
    metalness: 1,
    roughness: 0.2,
  },
  STRAND_2: {
    color: "#FF1493",
    emissive: "#FF1493",
    emissiveIntensity: 0.8,
    metalness: 1,
    roughness: 0.2,
  },
  BASE_PAIR: {
    color: "#FFD700",
    emissive: "#FFD700",
    emissiveIntensity: 0.6,
    metalness: 0.8,
    roughness: 0.3,
  },
} as const;
