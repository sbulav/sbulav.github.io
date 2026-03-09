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
        // Semantic theme tokens backed by CSS variables
        bg: {
          DEFAULT: 'rgb(var(--color-bg) / <alpha-value>)',
          secondary: 'rgb(var(--color-bg-secondary) / <alpha-value>)',
          tertiary: 'rgb(var(--color-bg-tertiary) / <alpha-value>)',
        },
        fg: {
          DEFAULT: 'rgb(var(--color-fg) / <alpha-value>)',
          muted: 'rgb(var(--color-fg-muted) / <alpha-value>)',
          dim: 'rgb(var(--color-fg-dim) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--color-accent) / <alpha-value>)',
          hover: 'rgb(var(--color-accent-hover) / <alpha-value>)',
          dim: 'rgb(var(--color-accent-dim) / <alpha-value>)',
          subtle: 'rgb(var(--color-accent) / 0.12)',
        },
        category: {
          DEFAULT: 'rgb(var(--color-category) / <alpha-value>)',
          hover: 'rgb(var(--color-category-hover) / <alpha-value>)',
          dim: 'rgb(var(--color-category-dim) / <alpha-value>)',
        },
        tag: {
          DEFAULT: 'rgb(var(--color-tag) / <alpha-value>)',
          hover: 'rgb(var(--color-tag-hover) / <alpha-value>)',
          dim: 'rgb(var(--color-tag-dim) / <alpha-value>)',
        },
        date: {
          DEFAULT: 'rgb(var(--color-date) / <alpha-value>)',
          dim: 'rgb(var(--color-date-dim) / <alpha-value>)',
        },
        border: {
          DEFAULT: 'rgb(var(--color-border) / <alpha-value>)',
          hover: 'rgb(var(--color-border-hover) / <alpha-value>)',
          subtle: 'rgb(var(--color-border-subtle) / <alpha-value>)',
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
