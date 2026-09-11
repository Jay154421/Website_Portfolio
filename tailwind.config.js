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
          DEFAULT: '#95271D',
          50: '#fdf2f1',
          100: '#fce4e2',
          200: '#faccc9',
          300: '#f5a5a0',
          400: '#ed726a',
          500: '#e04d43',
          600: '#c93529',
          700: '#95271D',
          800: '#7c2219',
          900: '#68201a',
          950: '#390c09',
        },
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      keyframes: {
        'slide-in': {
          '0%': {
            opacity: '0',
            transform: 'translateX(-20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
      },
      animation: {
        'slide-in': 'slide-in 0.5s ease-out forwards',
      },
    },
  },
  plugins: [],
}
