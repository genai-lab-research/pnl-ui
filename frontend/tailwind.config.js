/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      gridTemplateColumns: {
        '20': 'repeat(20, minmax(0, 1fr))',
      },
      colors: {
        'whispering-cloud': '#f8f9fa',
        'midnight-black': '#000000',
        'snow-white': '#ffffff',
        'silver-polish': '#c0c0c0',
        'steel-smoke': '#708090',
        'lilac-haze': '#dda0dd',
      },
    },
  },
  plugins: [],
}
