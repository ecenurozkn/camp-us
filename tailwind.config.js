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
        campus: {
          primary: '#4F46E5',
          secondary: '#0EA5E9',
          surface: '#F8FAFC',
          card: '#FFFFFF',
        }
      },
      boxShadow: {
        'soft': '0 10px 30px -6px rgba(15, 23, 42, 0.06), 0 4px 12px -2px rgba(79, 70, 229, 0.04)',
        'soft-lg': '0 18px 40px -10px rgba(79, 70, 229, 0.14), 0 6px 16px -4px rgba(15, 23, 42, 0.06)',
        'nav': '0 -8px 28px -6px rgba(15, 23, 42, 0.08)',
      },
    },
  },
  plugins: [],
};
