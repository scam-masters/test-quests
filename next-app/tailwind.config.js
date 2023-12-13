/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'tq-primary': 'var(--color-primary)',
        'tq-accent': 'var(--color-accent)',
        'tq-gray': 'var(--color-gray)',
        'tq-red': 'var(--color-red)',
        'tq-yellow': 'var(--color-yellow)',
        'tq-green': 'var(--color-green)',
        'tq-white': 'var(--color-white)',
        'tq-black': 'var(--color-black)',
      },
      fontFamily: {
        'logo': ['Lexend Deca', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
