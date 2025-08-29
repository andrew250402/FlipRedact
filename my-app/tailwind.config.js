/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
  "./index.html",
  "./src/**/*.{js,jsx,ts,tsx}",
],
  theme: {
  extend: {
    colors: {
      brand: {
        DEFAULT: '#004085',
        light: '#3366cc',
        dark: '#00264d',
      },
    },
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['Fira Code', 'monospace'],
    },
  },
},

  plugins: [],
};