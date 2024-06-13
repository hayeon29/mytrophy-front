import type { Config } from 'tailwindcss';
import { nextui } from '@nextui-org/react';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        primary: '#5779E9',
        second: '#FB5D8D',
        lightGray: '#D9D9D9',
        blackGray: '#B1B1B1',
        gray: '#CBD5E1',
        blueGray: '#D2DAF8',
        blueBlack: '#2E396C',
        kakao: '#FFEB00',
        kakaoText: '#3C1E1E',
        steamGradientFrom: '#101C2F',
        steamGradientVia: '#0D2252',
        steamGradientTo: '#1382B3',
        naver: '#03C75A',
        disable: '#D9D9D9',
      },
      boxShadow: {
        disabled: '0 0 0px 1000px #FFF inset',
      },
      dropShadow: {
        primary: '0 4px 12px rgba(87, 121, 233, 0.15)',
      },
    },
  },
  darkMode: 'class',
  plugins: [
    nextui({
      addCommonColors: true,
      themes: {
        light: {
          colors: {
            primary: '#5779E9',
            secondary: '#FB5D8D',
            foreground: '#FFFFFF',
          },
        },
      },
    }),
  ],
};
export default config;
