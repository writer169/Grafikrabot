/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        tastak: {
          from: '#10b981', // emerald-500
          to: '#0f766e',   // teal-700
        },
        saryarka: {
          from: '#8b5cf6', // violet-500
          to: '#4f46e5',   // indigo-600
        },
        off: {
          from: '#fb7185', // rose-400
          to: '#f43f5e',   // rose-500
        }
      }
    },
  },
  plugins: [],
}