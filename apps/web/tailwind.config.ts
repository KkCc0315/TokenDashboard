import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#101827",
        mist: "#eef4f6",
        tide: "#86d0c5",
        ember: "#f97352",
        glow: "#f8d17a"
      },
      boxShadow: {
        soft: "0 18px 60px rgba(16, 24, 39, 0.12)"
      },
      backgroundImage: {
        grid: "linear-gradient(rgba(16, 24, 39, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 24, 39, 0.08) 1px, transparent 1px)"
      }
    }
  },
  plugins: []
};

export default config;
