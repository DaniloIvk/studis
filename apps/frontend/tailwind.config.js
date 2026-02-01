import colors from 'tailwindcss/colors';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      xs: '430px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        /**
         * Main colors
         */
        primary: {
          DEFAULT: '#677DB7', // Glaucous
          hover: '#5B72AC',
          light: '#8A9CD8',
          dark: '#506599',
        },
        neutral: {
          DEFAULT: '#8E9196', // Cool Gray / Silver Chalice
          light: colors.neutral[400],
          dark: colors.neutral[500],
        },
        light: '#FBFEF9', // Porcelain
        'light-gray': '#DBDED9', // Fleur de Sel
        dark: '#191923', // Shadow Gray
        darker: '#0D0C0E', // Dark void

        /**
         * Detail colors
         */
        success: {
          DEFAULT: colors.lime[600],
          light: colors.lime[500],
          dark: colors.lime[700],
        },
        warn: {
          DEFAULT: colors.amber[600],
          light: colors.amber[500],
          dark: colors.amber[700],
        },
        error: {
          DEFAULT: colors.red[700],
          light: colors.red[600],
          dark: colors.red[800],
        },
        danger: {
          DEFAULT: colors.red[600],
          light: colors.red[500],
          dark: colors.red[700],
        },
      },
      dropShadow: {
        'top-md': '0 -3px 3px var(--tw-shadow-color, rgb(0 0 0 / 0.12))',
        'bottom-md': '0 3px 3px var(--tw-shadow-color, rgb(0 0 0 / 0.12))',
        icon: '0 1px 1px var(--tw-shadow-color, rgb(0 0 0 / 0.5))',
      },
    },
  },
  plugins: [],
};
