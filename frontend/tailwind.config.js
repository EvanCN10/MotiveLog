/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'seacat-dark': '#020204',
        'seacat-blue': '#0a192f',
        'neon-orange': '#FF6B00',
        'neon-cyan': '#00F0FF',
        'glass': 'rgba(10, 25, 47, 0.4)',
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
      letterSpacing: {
        'widest-xl': '0.3em',
      }
    },
  },
  plugins: [],
}