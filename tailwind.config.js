/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"Inter"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        abu: {
          petrol: '#142E2C',
          deep: '#1D3534',
          forest: '#3A5A58',
          sage: '#6B8E88',
          mint: '#A9C6C1',
          cream: '#F4F8F7',
          amber: '#FF8A3D',
          amberDark: '#E66B1F',
        },
      },
      boxShadow: {
        'glass': '0 16px 40px -8px rgba(15, 36, 34, 0.18), inset 0 1px 1px 0 rgba(255, 255, 255, 0.65)',
        'glass-sm': '0 8px 24px -4px rgba(15, 36, 34, 0.12), inset 0 1px 1px 0 rgba(255, 255, 255, 0.55)',
        'glass-dark': '0 20px 44px -10px rgba(9, 22, 21, 0.42), inset 0 1px 1px 0 rgba(255, 255, 255, 0.18)',
        'pill': '0 20px 45px -10px rgba(12, 30, 29, 0.48)',
      },
    },
  },
  plugins: [],
};
