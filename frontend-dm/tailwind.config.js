/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        '4xl': '2.5rem',
      },
      // CONTROL LETTER SPACING HERE
      letterSpacing: {
        'brand-tight': '-0.02em',   // For main headings (makes them look premium)
        'brand-normal': '0em',      // For body text
        'brand-compressed': '-0.01em', // For table data so it fits better
      },
      fontWeight: {
        'brand-heading': '800',      
        'brand-table-head': '800',   
        'brand-body-bold': '700',    
        'brand-detail': '600',       
      },
      colors: {
        brand: {
          darkText: '#cbd5e1', // slate-300
          lightText: '#475569', // slate-600
        }
      }
    },
  },
  plugins: [],
}