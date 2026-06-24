import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm off-white surface palette (Mercury.com inspired light mode)
        surface: {
          50:  "#fbfcfd", // page background
          100: "#f2ede6", // sidebar background
          200: "#e8e1d8", // card background
          300: "#d4cbbf", // borders
          400: "#b8ada0", // muted borders
        },
        text: {
          primary:   "#1a1814", // near-black headings
          secondary: "#4a4540", // body text
          muted:     "#8c8680", // labels, placeholders
        },
        accent: {
          DEFAULT: "#8b6f47", // warm brown
          muted:   "#f0e8dc", // accent bg tint
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      animation: {
        "fade-up": "fadeUp 0.5s ease forwards",
        "fade-in": "fadeIn 0.4s ease forwards",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
