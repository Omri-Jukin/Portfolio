// Heavy components that should be dynamically imported to improve build performance
// These components use Three.js, complex animations, or other resource-intensive libraries

export { default as Galaxy } from "../GalaxyCard/Galaxy";
export { default as GalaxyCard } from "../GalaxyCard/GalaxyCard";
export { default as GlobeBackground } from "../GlobeBackground";
export { default as DNAHelix } from "../DNAHelix";
export { DNAHelixWrapper } from "../DNAHelix";
export { ParticleBridge } from "../ParticleBridge/ParticleBridge";
export { InnovationFlow } from "../InnovationFlow/InnovationFlow";
export { VisionRealityBridge } from "../VisionRealityBridge/VisionRealityBridge";
export { ColorWorm } from "../ColorWorm/ColorWorm";
export { FloatingEmojis } from "../FloatingEmojis/FloatingEmojis";
export { WaveText } from "../WaveText/WaveText";
export { ConnectionLine } from "../ConnectionLine";
export { CollaborationHub } from "../CollaborationHub";

// Type exports for heavy components
export type { GalaxyProps } from "../GalaxyCard/Galaxy.type";
export type { GalaxyCardProps } from "../GalaxyCard/GalaxyCard";
export type { GlobeBackgroundProps, GlobeMarker } from "../GlobeBackground";
export type { DNAModelProps } from "../DNAHelix";
export type { ParticleBridgeProps } from "../ParticleBridge/ParticleBridge.type";
export type { InnovationFlowProps } from "../InnovationFlow/InnovationFlow.type";
export type { VisionRealityBridgeProps } from "../VisionRealityBridge/VisionRealityBridge.type";
export type { ColorWormProps } from "../ColorWorm/ColorWorm.type";
export type { FloatingEmojisProps } from "../FloatingEmojis/FloatingEmojis.type";
export type { WaveTextProps } from "../WaveText/WaveText.type";
export type { ConnectionLineProps } from "../ConnectionLine";
export type { CollaborationHubProps } from "../CollaborationHub";
