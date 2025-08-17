import { GlobeMarker } from "./GlobeBackground.type";

// Default markers for interesting locations around the world
export const DEFAULT_GLOBE_MARKERS: GlobeMarker[] = [
  // Tech hubs
  { location: [37.7749, -122.4194], size: 0.08 }, // San Francisco
  { location: [40.7128, -74.006], size: 0.08 }, // New York
  { location: [51.5074, -0.1278], size: 0.07 }, // London
  { location: [35.6762, 139.6503], size: 0.07 }, // Tokyo
  { location: [37.5665, 126.978], size: 0.06 }, // Seoul
  { location: [31.2304, 121.4737], size: 0.06 }, // Shanghai
  { location: [52.52, 13.405], size: 0.05 }, // Berlin
  { location: [55.7558, 37.6176], size: 0.05 }, // Moscow
  { location: [19.076, 72.8777], size: 0.05 }, // Mumbai
  { location: [12.9716, 77.5946], size: 0.05 }, // Bangalore

  // Additional interesting locations
  { location: [25.2048, 55.2708], size: 0.04 }, // Dubai
  { location: [1.3521, 103.8198], size: 0.04 }, // Singapore
  { location: [-33.8688, 151.2093], size: 0.04 }, // Sydney
  { location: [45.5017, -73.5673], size: 0.04 }, // Montreal
  { location: [59.3293, 18.0686], size: 0.03 }, // Stockholm
  { location: [60.1695, 24.9354], size: 0.03 }, // Helsinki
];

// Alternative marker sets for different themes
export const TECH_CITIES_MARKERS: GlobeMarker[] = [
  { location: [37.7749, -122.4194], size: 0.1 }, // San Francisco
  { location: [47.6062, -122.3321], size: 0.08 }, // Seattle
  { location: [40.7128, -74.006], size: 0.08 }, // New York
  { location: [42.3601, -71.0589], size: 0.07 }, // Boston
  { location: [30.2672, -97.7431], size: 0.07 }, // Austin
  { location: [51.5074, -0.1278], size: 0.07 }, // London
  { location: [52.3676, 4.9041], size: 0.06 }, // Amsterdam
  { location: [59.3293, 18.0686], size: 0.06 }, // Stockholm
  { location: [35.6762, 139.6503], size: 0.07 }, // Tokyo
  { location: [37.5665, 126.978], size: 0.06 }, // Seoul
];

export const BUSINESS_HUBS_MARKERS: GlobeMarker[] = [
  { location: [40.7128, -74.006], size: 0.1 }, // New York
  { location: [51.5074, -0.1278], size: 0.09 }, // London
  { location: [35.6762, 139.6503], size: 0.08 }, // Tokyo
  { location: [22.3193, 114.1694], size: 0.07 }, // Hong Kong
  { location: [1.3521, 103.8198], size: 0.07 }, // Singapore
  { location: [25.2048, 55.2708], size: 0.06 }, // Dubai
  { location: [52.52, 13.405], size: 0.06 }, // Berlin
  { location: [48.8566, 2.3522], size: 0.06 }, // Paris
  { location: [41.9028, 12.4964], size: 0.05 }, // Rome
  { location: [-23.5505, -46.6333], size: 0.05 }, // São Paulo
];

export const ISRAEL_MARKERS: GlobeMarker[] = [
  { location: [31.2518, 34.7915], size: 0.06 }, // Be'er Sheva
  { location: [31.7683, 35.2137], size: 0.06 }, // Jerusalem
  { location: [32.0853, 34.7818], size: 0.06 }, // Tel Aviv
];

export const ALL_MARKERS: GlobeMarker[] = [
  ...DEFAULT_GLOBE_MARKERS,
  ...TECH_CITIES_MARKERS,
  ...BUSINESS_HUBS_MARKERS,
  ...ISRAEL_MARKERS,
];

// Default configuration
export const DEFAULT_GLOBE_CONFIG = {
  size: 800,
  rotationSpeed: 0.005,
  opacity: 0.3,
} as const;
