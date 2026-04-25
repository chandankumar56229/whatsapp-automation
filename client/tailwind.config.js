/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#000000',
        'primary-light': '#1a1a1a',
        accent: '#ffffff',
        'accent-light': '#f5f5f5',
        'accent-dark': '#e0e0e0',
        gray: {
          50: '#FAFAFA', 100: '#F5F5F5', 200: '#E5E5E5', 300: '#D4D4D4',
          400: '#A3A3A3', 500: '#737373', 600: '#525252', 700: '#404040',
          800: '#262626', 900: '#171717',
        },
      },
      fontFamily: {
        heading: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        card: '0 0 40px rgba(0,0,0,0.04)',
        accent: '0 4px 14px rgba(0, 0, 0, 0.15)',
      },
      borderRadius: {
        'xl-soft': '24px',
      },
    },
  },
  plugins: [],
};
