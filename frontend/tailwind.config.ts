import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0F1115",
        surface: "#181B21",
        "surface-hover": "#222630",
        border: "#2A2E36",
        gold: {
          DEFAULT: "#D9A441",
          hover: "#EBB552",
          dim: "rgba(217, 164, 65, 0.15)",
        },
      },
    },
  },
  plugins: [],
};
export default config;
