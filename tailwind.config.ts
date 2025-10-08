import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#1a73e8',
          foreground: '#ffffff',
        },
      },
    },
  },
  plugins: [],
};

export default config;
