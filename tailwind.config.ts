import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        'lightShades': '#F8F7F7',
        'lightAccents': '#94948C',
        'mainColor': '#A2A7A6',
        'darkAccent': '#82868E',
        'darkShades': '#3F3E3E',
        'success': '#66ad6a',
        'warning': '#e39d32',
        'danger': '#f44336',
      },
    },
  },
  plugins: [],
}
export default config
