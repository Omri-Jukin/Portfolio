// no dark colors allowed

export const generateRandomHexColor = () => {
  // Generate bright, vibrant colors using HSL instead of random hex
  // Hue: 0-360 (full color spectrum)
  // Saturation: 70-100 (vibrant, not washed out)
  // Lightness: 50-80 (bright, not too dark or too light)
  const hue = Math.floor(Math.random() * 360);
  const saturation = Math.floor(Math.random() * 31) + 70; // 70-100%
  const lightness = Math.floor(Math.random() * 31) + 50; // 50-80%

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

export const generateRandomHexColorPerLetter = (letter: string) => {
  // Use letter's char code to ensure consistent colors per letter
  const charCode = letter.charCodeAt(0);
  const hue = (charCode * 13) % 360; // Different hue for each letter
  const saturation = 70 + (charCode % 31); // 70-100%
  const lightness = 50 + (charCode % 31); // 50-80%

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

export const colorEachLetter = (text: string) => {
  const letters = text.split("");
  const colors = letters.map((letter) =>
    generateRandomHexColorPerLetter(letter)
  );
  return colors.join("");
};

export const generateRandomFontSize = () => {
  const fontSizes = [
    "1rem",
    "2rem",
    "3rem",
    "4rem",
    "5rem",
    "6rem",
    "7rem",
    "8rem",
    "9rem",
    "10rem",
  ];
  return fontSizes[Math.floor(Math.random() * fontSizes.length)];
};

// Alternative: Generate from predefined vibrant color palette
export const generateFromColorPalette = (seed?: string | number) => {
  const vibrantColors = [
    "#FF6B6B", // Red
    "#4ECDC4", // Teal
    "#45B7D1", // Blue
    "#96CEB4", // Green
    "#FFEAA7", // Yellow
    "#DDA0DD", // Purple
    "#FF8A65", // Orange
    "#81C784", // Light Green
    "#64B5F6", // Light Blue
    "#FFB74D", // Amber
    "#F06292", // Pink
    "#9575CD", // Deep Purple
  ];

  // If no seed provided, use a default index to ensure consistency
  if (seed === undefined) {
    return vibrantColors[0]; // Default to first color for consistency
  }

  // Create a deterministic hash from the seed
  let hash = 0;
  const seedStr = String(seed);
  for (let i = 0; i < seedStr.length; i++) {
    const char = seedStr.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  // Use the hash to select a color
  const index = Math.abs(hash) % vibrantColors.length;
  return vibrantColors[index];
};
