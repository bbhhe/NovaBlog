/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#1e1e1e',
        'dark-surface': '#2b2b2b',
        'dark-border': '#444',
        'text-primary': '#ffffff',
        'text-secondary': '#a0a0a0',
        'text-muted': '#b0b0b0',
        'accent': '#f79e1b',
        'accent-hover': '#ff8c00',
      },
      fontFamily: {
        'mono': ['Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
}