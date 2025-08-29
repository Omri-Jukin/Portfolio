export type AnimationType =
  | "torusKnot"
  | "stars"
  | "polyhedron"
  | "box"
  | "circle"
  | "cone"
  | "cylinder"
  | "sphere"
  | "plane"
  | "tube"
  | "torus"
  | "torusKnot"
  | "tetrahedron"
  | "ring"
  | "polyhedron"
  | "icosahedron"
  | "octahedron"
  | "dodecahedron"
  | "extrude"
  | "lathe"
  | "capsule"
  | "shape"
  | "dna";

export interface AnimatedBackgroundProps {
  animationType: AnimationType;
  path?: string; // Current path for path-dependent animations
  manualOverride?: boolean; // Whether user manually overrode the animation
}
