/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0e1117',
        surface: '#161b24',
        border: '#252d3a',
        amber: {
          DEFAULT: '#e8a020',
          dim: '#7a4f08',
          bg: '#1a1000',
        },
        ink: {
          DEFAULT: '#e8e0d5',
          mid: '#9a9080',
          dim: '#4a4540',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
    },
  },
  plugins: [],
}
