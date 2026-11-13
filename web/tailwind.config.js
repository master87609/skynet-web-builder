/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        skynet: {
          void: "#0A0A0A",
          surface: "#141414",
          "surface-hover": "#1F1F1F",
          border: "#2E2E2E",
          // Neutral ramp retinted for WCAG AA on void (#0A0A0A) and surface (#141414).
          // dust: 6.7:1 on void, 6.6:1 on surface. dust-sm: 9.9:1 on void.
          dust: "#9A9A9A",
          "dust-sm": "#B5B5B5",
          ivory: "#F0F0F0",
          white: "#FFFFFF",
          amber: "#FFB900",
          "amber-deep": "#E0A800",
          "amber-bright": "#FFD24D",
          success: "#4ADE80",
          warning: "#FACC15",
          error: "#F87171",
        },
      },
      fontFamily: {
        sans: ["var(--font-archivo)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
    },
  },
  plugins: [],
}
