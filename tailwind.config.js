/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ff8901', 
        secondary: '#fb923c', 
        travelBlue: '#1e3a8a', 
        travelGreen: '#15803d', 
        neutralBg: '#f1f5f9', 
        accent: '#fef3c7', 
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
      },
      backgroundImage: {
        'map-texture': "url('/images/map-texture.png')", 
      },
      boxShadow: {
        'travel-shadow': '0 4px 6px -1px rgba(30, 58, 138, 0.1), 0 2px 4px -1px rgba(30, 58, 138, 0.06)', 
      },
    },
  },
  plugins: [],
};