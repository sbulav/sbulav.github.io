/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'SF Mono', 'Cascadia Code', 'ui-monospace', 'monospace'],
      },
      colors: {
        // Main background - near black
        bg: {
          DEFAULT: '#0a0a0a',
          secondary: '#111111',
          tertiary: '#1a1a1a',
        },
        // Main foreground - off-white for readability
        fg: {
          DEFAULT: '#e8e8e8',
          muted: '#9a9a9a',
          dim: '#6b6b6b',
        },
        // Primary accent - vibrant green (devops/engineering feel)
        accent: {
          DEFAULT: '#00d084',
          hover: '#00e691',
          dim: '#00a868',
          subtle: 'rgba(0, 208, 132, 0.1)',
        },
        // Secondary colors for semantic meaning
        // Blue for categories (trust, organization)
        category: {
          DEFAULT: '#58a6ff',
          hover: '#79b8ff',
          dim: '#388bfd',
        },
        // Amber/gold for tags (warmth, highlights)
        tag: {
          DEFAULT: '#d4a72c',
          hover: '#e3b341',
          dim: '#b0882e',
        },
        // Date - subtle cyan (time, freshness)
        date: {
          DEFAULT: '#39c5cf',
          dim: '#2a9aa2',
        },
        // Borders
        border: {
          DEFAULT: '#2d2d2d',
          hover: '#3d3d3d',
          subtle: '#1a1a1a',
        },
      },
      maxWidth: {
        'content': '900px',
        'wide': '1100px',
      },
    },
  },
  plugins: [],
};
