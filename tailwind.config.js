const { hairlineWidth } = require('nativewind/theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2e7d32',
          light: '#a5d6a7',
          surface: '#e8f5e9',
        },
        user: {
          DEFAULT: '#d32f2f',
          surface: '#ffebee',
        },
        neutral: {
          100: '#f5f5f5',
          200: '#e0e0e0',
          300: '#999',
          700: '#333',
        },
      },
    },
  },
  plugins: [],
};
