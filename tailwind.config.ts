import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          // Negros y grafitos de la marca
          950: "#070708",
          900: "#0c0d10",
          850: "#121317",
          800: "#16181d",
          700: "#1d2026",
          600: "#262a32",
          500: "#343843",
          400: "#4a4f5c",
        },
        ember: {
          // Naranja brillante para CTAs / acentos
          50: "#fff4ec",
          100: "#ffe2cc",
          200: "#ffc299",
          300: "#ff9d5c",
          400: "#ff7a1a",
          500: "#ff6a00",
          600: "#e85d00",
          700: "#c24a00",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Oswald", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        ember: "0 10px 40px -12px rgba(255, 106, 0, 0.45)",
        card: "0 18px 50px -20px rgba(0, 0, 0, 0.8)",
      },
      backgroundImage: {
        "grid-faint":
          "linear-gradient(to right, rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.035) 1px, transparent 1px)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.16,1,0.3,1) both",
        "fade-in": "fade-in 0.8s ease both",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
