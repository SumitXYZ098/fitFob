/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,tsx}', './components/**/*.{js,ts,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#E23744',
        success: '#22C55E',
        background: '#ffffff',
        darkText: '#1C1C1C',
        secondaryText: '#6B7280',
        border: '#E5E7EB',
      },
      fontFamily:{
        sans:['']
      }
    },
  },
  plugins: [],
};
