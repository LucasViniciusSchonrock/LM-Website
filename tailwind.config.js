/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        apple: {
          purple: {
            DEFAULT: '#8B5CF6',
            50: '#F5F3FF',
            100: '#EDE9FE',
            200: '#DDD6FE',
            300: '#C4B5FD',
            400: '#A78BFA',
            500: '#8B5CF6',
            600: '#7C3AED',
            700: '#6D28D9',
            800: '#5B21B6',
            900: '#4C1D95',
            ios: '#AF52DE',
          },
          bg: {
            light: '#F2F2F7',
            cardLight: 'rgba(255, 255, 255, 0.8)',
            dark: '#000000',
            cardDark: 'rgba(28, 28, 30, 0.75)',
            sheetDark: '#1C1C1E',
          },
          border: {
            light: 'rgba(60, 60, 67, 0.12)',
            dark: 'rgba(255, 255, 255, 0.12)',
          }
        }
      },
      borderRadius: {
        'ios': '20px',
        'ios-lg': '26px',
        'ios-card': '22px',
      },
      boxShadow: {
        'ios': '0 4px 20px -2px rgba(0, 0, 0, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'ios-purple': '0 8px 30px -4px rgba(139, 92, 246, 0.35)',
        'ios-glow': '0 0 25px -3px rgba(175, 82, 222, 0.4)',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro Text"',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
      },
      backdropBlur: {
        'ios': '24px',
      }
    },
  },
  plugins: [],
};

