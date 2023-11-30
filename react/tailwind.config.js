/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": '#3C486B',
        "secondary": {
          1: '#F9D949',
          2: '#F45050',
        },
        'white-alt': '#F0F0F0',
      },
      fontFamily: {
        'logo': ['Lexend Deca', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

