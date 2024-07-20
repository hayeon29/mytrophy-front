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
        'arrow-down': "url('/svgs/arrow_down.svg')",
      },
      maxWidth: {
        1280: '1280px',
      },
      minWidth: {
        1024: '1024px',
      },
      colors: {
        primary: '#526DE4',
        second: '#FB5D8D',
        black: '#212529',
        lightGray: '#FAFCFF',
        blackGray: '#B1B1B1',
        textBlack: '#1E293B',
        gray: '#9CA3AF',
        whiteBlue: '#F8FAFC',
        lightBlue: '#D2DAF8',
        neonLightBlue: '#EAECFF',
        blueLightGray: '#E2E8F0',
        blueGray: '#CBD5E1',
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
        gray: '0px 4px 24px 0px rgba(46,57,108,0.15)',
        blueGray: '0px 4px 24px 0px rgba(46,57,108,0.45)',
      },
      dropShadow: {
        primary: '0 4px 12px rgba(47, 57, 108, 0.10)',
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
