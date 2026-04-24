/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B0F19',
        surface: '#1A233A',
        primary: '#3B82F6',
        secondary: '#10B981',
        accent: '#8B5CF6',
        text: '#F8FAFC',
        textMuted: '#94A3B8',
        border: '#2E3B52'
      }
    },
  },
  plugins: [],
}
