/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'tq-primary': 'var(--color-primary)',
        'tq-accent':  'var(--color-accent)',
        'tq-gray':    'var(--color-gray)',
        'tq-red':     'var(--color-red)',
        'tq-yellow':  'var(--color-yellow)',
        'tq-green':   'var(--color-green)',
        'tq-white':   'var(--color-white)',
        'tq-black':   'var(--color-black)',
      },
      fontFamily: {
        'logo': ['Lexend Deca', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

