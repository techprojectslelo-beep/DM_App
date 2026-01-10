/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // This is the most important line!
  ],
  theme: {
    extend: {
      borderRadius: {
        '4xl': '2.5rem', // Useful for your inverted curves
      }
    },
  },
  plugins: [],
}