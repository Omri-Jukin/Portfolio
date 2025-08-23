import { ReactNode } from "react";
export interface GlobeMarker {
  location: [number, number]; // [latitude, longitude]
  size: number;
}
export interface GlobeBackgroundProps {
  markers?: Array<GlobeMarker>;
  className?: string;
  rotationSpeed?: number;
  size?: number;
  opacity?: number;
  children?: ReactNode;
  // New props for grid-based positioning
  showGrid?: boolean;
  enableGridPositioning?: boolean;
  customGridConfig?: {
    columns: number;
    rows: number;
    globe: {
      startColumn: number;
      endColumn: number;
      startRow: number;
      endRow: number;
    };
  };
}

// Grid positioning result
export interface GridPosition {
  left: number;
  top: number;
  transform: string;
}

// Device type for grid configuration
export type DeviceType = "desktop" | "tablet" | "mobile";

// Grid cell information for debugging
export interface GridCell {
  column: number;
  row: number;
  x: number;
  y: number;
  width: number;
  height: number;
  isGlobeCell: boolean;
}
