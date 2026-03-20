/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          900: '#312e81'
        }
      },
      boxShadow: {
        glow: '0 10px 30px rgba(79, 70, 229, 0.18)'
      }
    }
  },
  plugins: []
};
