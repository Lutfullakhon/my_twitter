// tailwind.config.ts
import type { Config } from "tailwindcss"

export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // adjust to your folders
  ],
  theme: {
    extend: {
      colors: {
        brand: "#1DA1F2", // example custom color
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config
