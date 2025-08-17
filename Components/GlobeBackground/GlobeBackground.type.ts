export interface GlobeMarker {
  location: [number, number]; // [latitude, longitude]
  size: number;
}

export interface GlobeBackgroundProps {
  /** Array of markers to display on the globe */
  markers?: GlobeMarker[];
  /** Additional CSS class name */
  className?: string;
  /** Globe rotation speed (default: 0.005) */
  rotationSpeed?: number;
  /** Globe size in pixels (default: 800) */
  size?: number;
  /** Globe opacity (default: 0.3) */
  opacity?: number;
  /** Content to render on top of the globe */
  children?: React.ReactNode;
}
