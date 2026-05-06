import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          500: '#3DA563',
          700: '#1B5E3B',
        },
        gold: {
          400: '#D4A84B',
          500: '#C8944A',
          600: '#B07D3A',
        },
      },
    },
  },
  plugins: [],
}

export default config
