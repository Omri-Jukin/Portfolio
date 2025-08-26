import { ReactNode } from "react";
export interface GlobeMarker {
  location: [number, number]; // [latitude, longitude]
  size: number;
}
export interface GlobeBackgroundProps {
  markers?: Array<GlobeMarker>;
  className?: string;
  rotationSpeed?: number;
  opacity?: number;
  children?: ReactNode;
}

// Device type for grid configuration
export type DeviceType = "desktop" | "tablet" | "mobile";
