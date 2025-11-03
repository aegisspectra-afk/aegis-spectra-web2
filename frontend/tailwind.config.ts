import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        gold: "#D4AF37",
        charcoal: "#141418",
        burgundy: "#5A0F17"
      }
    }
  },
  plugins: [],
};
export default config;

