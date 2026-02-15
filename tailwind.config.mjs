/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        bg: {
          DEFAULT: '#0d0d0d',
          light: '#f5f5f5',
        },
        fg: {
          DEFAULT: '#e6e6e6',
          dark: '#1a1a1a',
        },
        accent: {
          DEFAULT: '#02d47f',
          dark: '#0a7c4c',
        },
        border: {
          DEFAULT: '#2d2d2d',
          light: '#e0e0e0',
        },
      },
    },
  },
  plugins: [],
};
