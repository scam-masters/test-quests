/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'tq-primary': '#374161',
        'tq-accent':  '#3C486B',
        'tq-red':     '#F45050',
        'tq-yellow':  '#F9D949',
        'tq-green':   '#69995D',
        'tq-white':   '#F0F0F0',
      },
      fontFamily: {
        'logo': ['Lexend Deca', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

