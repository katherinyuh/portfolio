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
        red: {
          50:  "#FEF2F2",
          100: "#FDE3E3",
          200: "#FCCCCC",
          300: "#F9A8A8",
          400: "#F37676",
          500: "#E84B4B",
          600: "#D52D2D",
          700: "#B22222",
          800: "#942020",
          900: "#7B2121",
          950: "#430C0C",
          DEFAULT: "#B22222", // firebrick red
          muted:   "#FDE3E3", // red bg tint
        },
        slate: {
          50:  "#F4F4F5",
          100: "#EEEEF0",
          200: "#DADADD",
          300: "#B9BAC0",
          400: "#93949D",
          500: "#767681",
          600: "#606169",
          700: "#4E4E56",
          800: "#434349",
          900: "#3B3C3F",
          950: "#27272A",
          DEFAULT: "#F4F4F5",
        },
      },
      fontSize: {
        xs:   ['var(--font-size-xs)',   { lineHeight: '1.5',   letterSpacing: '0em' }],
        sm:   ['var(--font-size-sm)',   { lineHeight: '1.5',   letterSpacing: '0em' }],
        base: ['var(--font-size-base)', { lineHeight: '1.5',   letterSpacing: '0em' }],
        lg:   ['var(--font-size-lg)',   { lineHeight: '1.625', letterSpacing: '0em' }],
        xl:   ['var(--font-size-xl)',   { lineHeight: '1.333', letterSpacing: '-0.02em' }],
        '2xl': ['var(--font-size-2xl)', { lineHeight: '1.333', letterSpacing: '-0.02em' }],
        '3xl': ['var(--font-size-3xl)', { lineHeight: '1.2',   letterSpacing: '-0.02em' }],
        '4xl': ['var(--font-size-4xl)', { lineHeight: '1.2',   letterSpacing: '-0.03em' }],
        '5xl': ['var(--font-size-5xl)', { lineHeight: '1',     letterSpacing: '-0.03em' }],
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
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
