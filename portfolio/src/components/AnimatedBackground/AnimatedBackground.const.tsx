// Animation type mappings for different paths
export const PATH_ANIMATION_MAPPINGS = {
  "": "torusKnot",
  home: "torusKnot",
  about: "dna",
  contact: "stars",
  blog: "polyhedron",
  career: "dna",
  resume: "torusKnot",
  admin: "stars",
} as const;

// Valid locale codes
export const VALID_LOCALES = ["en", "es", "fr", "he"] as const;

// Animation configuration
export const ANIMATION_CONFIG = {
  CAMERA: {
    position: [0, 0, 10] as [number, number, number],
    fov: 75,
  },
  LIGHTING: {
    ambient: {
      dark: { intensity: 0.2, color: "#001122" },
      light: { intensity: 0.4, color: "#112244" },
    },
    directional: {
      dark: { intensity: 2.0, color: "#00BFFF" },
      light: { intensity: 1.0, color: "#0066CC" },
    },
  },
} as const;
