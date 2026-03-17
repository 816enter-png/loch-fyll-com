/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        black: '#000000',
        dark: '#090909',
        darker: '#1b1b1b',
        white: '#ffffff',
        copper: '#b87333',
      },
      fontFamily: {
        brand: ['Bondrians', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
