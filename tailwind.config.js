/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lcd: {
          bg: '#758866',
          bgLight: '#8da67c',
          text: '#1a2614',
          dim: '#657757',
          blueBg: '#1b3240',
          blueText: '#38e4d8',
          blueDim: '#195563'
        },
        synth: {
          dark: '#1e2024',
          panel: '#282b30',
          border: '#383d45',
          accent: '#e67e22',
          cyan: '#00cec9',
          amber: '#f39c12'
        }
      },
      fontFamily: {
        mono: ['"Courier New"', 'Courier', 'monospace'],
        display: ['"Segment7"', '"Digital-7"', 'ui-monospace', 'monospace']
      }
    },
  },
  plugins: [],
}
