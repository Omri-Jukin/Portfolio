export const darkMode = "class";
export const content = ["./src/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"];

export const theme = {
  extend: {
    fontFamily: {
      "bona-nova": ["var(--font-bona-nova-sc)", "Bona Nova SC", "serif"],
      "bona-nova-mono": [
        "var(--font-bona-nova-sc-mono)",
        "Bona Nova SC",
        "serif",
      ],
    },
  },
};

export const plugins = [];
