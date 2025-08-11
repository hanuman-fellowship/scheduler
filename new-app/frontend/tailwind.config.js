/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        // Legacy app colors
        schedule: {
          bg: '#DFDBC3',
          hover: '#FFF8BA',
          selected: '#AAA',
          dayoff: '#DDDDDD',
          today: '#FFFADC',
          request: '#F8D793',
        }
      }
    },
  },
  plugins: [],
}