/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        black:  "#0A0A0A",
        black2: "#111111",
        black3: "#181818",
        green:  "#22C55E",
        green2: "#16A34A",
        green3: "#4ADE80",
        gold:   "#D4A017",
        gold2:  "#F0C040",
      },
      fontFamily: {
        sans:  ["IBM Plex Sans", "sans-serif"],
        serif: ["IBM Plex Serif", "serif"],
        mono:  ["IBM Plex Mono", "monospace"],
      },
    },
  },
  plugins: [],
}