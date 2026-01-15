/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      // 1. Force the professional font globally
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2.5rem', // For those smooth rounded containers in your reference
      },
      colors: {
        brand: {
          primary: '#465fff', // The signature blue from your sidebar
          darkText: '#cbd5e1', // slate-300 for Dark Theme
          lightText: '#475569', // slate-600 for Light Theme
        },
        surface: {
          light: '#f9fafb', // The soft background color in image_5dcfac
          dark: '#0f172a',
        }
      },
      // 2. Adjusting weights to match the "Clean" look (Less aggressive)
      fontWeight: {
        'heading': '600',  // SemiBold for titles
        'body': '400',     // Regular for standard text
        'detail': '500',   // Medium for navigation/buttons
      },
      letterSpacing: {
        'brand': '-0.01em', // Subtle compression for that premium feel
      }
    },
  },
  plugins: [],
}