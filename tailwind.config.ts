import type { Config } from "tailwindcss"

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  "#E8F5EC",
          100: "#C8E6D0",
          200: "#A5D6B4",
          300: "#7BC696",
          400: "#5AB57D",
          500: "#3DA563",  // 主色
          600: "#2E7D4B",
          700: "#1B5E3B",  // 深色主色
          800: "#134A2E",
          900: "#0B3621",
        },
        gold: {
          400: "#D4A84B",
          500: "#C8944A",  // 点缀暖金
          600: "#B07D3A",
        },
        surface: {
          bg:    "#F6F6F6",
          card:  "#FFFFFF",
          hover: "#EEEEEE",
          border:"#E8E8E8",
        },
        text: {
          primary:   "#1A1A1A",
          secondary: "#666666",
          muted:     "#999999",
          inverse:   "#FFFFFF",
        },
        functional: {
          red:    "#D94841",
          orange: "#E8833A",
          blue:   "#3B82C4",
        },
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      borderRadius: {
        'card': '12px',
        'btn':  '8px',
      },
    },
  },
  plugins: [],
}
export default config
