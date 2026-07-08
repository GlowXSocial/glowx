import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        glow: {
          50: '#fdf2ff',
          100: '#fbe4ff',
          200: '#f5c7fb',
          300: '#ed9bf5',
          400: '#e065ea',
          500: '#c832d4',
          600: '#a81bb3',
          700: '#8c1690',
          800: '#741775',
          900: '#621862',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 40px -10px rgba(200, 50, 212, 0.45)',
      },
    },
  },
  plugins: [],
};

export default config;