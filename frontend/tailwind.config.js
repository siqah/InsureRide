/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0A2463',
        secondary: '#3E92CC',
        success: '#00B894',
        danger: '#E74C5E',
        warning: '#FDCB6E',
      }
    },
  },
  plugins: [],
}
