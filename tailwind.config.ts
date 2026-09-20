import type { Config } from "tailwindcss";

// A colour that reads its RGB channels from a CSS variable, so Tailwind opacity modifiers still work.
const themed = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  darkMode: "media", // follow the visitor's system light/dark setting
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Colours come from CSS variables (see src/styles/globals.css), which hold the light values by
      // default and swap to the dark values when the system is in dark mode.
      colors: {
        card: themed("card"),
        surface: {
          50: themed("surface-50"), // page background
          100: themed("surface-100"),
          200: themed("surface-200"), // image frames
          300: themed("surface-300"), // borders
          400: themed("surface-400"), // muted borders
        },
        text: {
          primary: themed("text-primary"), // headings
          secondary: themed("text-secondary"), // body text
          muted: themed("text-muted"), // labels, placeholders
        },
        red: {
          50: "#FEF2F2",
          100: "#FDE3E3",
          200: "#FCCCCC",
          300: "#F9A8A8",
          400: "#F37676",
          500: "#E84B4B",
          600: "#D52D2D",
          700: themed("red"), // links / active state
          800: "#942020",
          900: "#7B2121",
          950: "#430C0C",
          DEFAULT: themed("red"),
          muted: themed("red-muted"), // red bg tint
        },
        // In dark mode this scale is inverted, so 50 is the page background and 950 the brightest.
        slate: {
          50: themed("slate-50"),
          100: themed("slate-100"),
          200: themed("slate-200"),
          300: themed("slate-300"),
          400: themed("slate-400"),
          500: themed("slate-500"),
          600: themed("slate-600"),
          700: themed("slate-700"),
          800: themed("slate-800"),
          900: themed("slate-900"),
          950: themed("slate-950"),
          DEFAULT: themed("slate-50"),
        },
      },
      // Square corners everywhere: every radius size is 0, so no `rounded-*` class can round anything.
      borderRadius: {
        none: "0",
        sm: "0",
        DEFAULT: "0",
        md: "0",
        lg: "0",
        xl: "0",
        "2xl": "0",
        "3xl": "0",
        full: "0",
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
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
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
