import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#437086',
        'primary-dark': '#355a6d',
        'primary-light': '#5a90a8',
        link: '#2ea3f2',
        accent: '#f8b841',
        'text-main': '#303232',
      },
      fontFamily: {
        sans: ['Open Sans', 'Arial', 'sans-serif'],
      },
      fontSize: {
        base: '1rem', // 16px minimum
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

export default config;
