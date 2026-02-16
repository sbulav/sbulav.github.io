# AGENTS.md - Coding Guidelines for sbulav.github.io

## Project Overview

Personal blog built with Astro 5, TypeScript, and TailwindCSS. Static site deployed to GitHub Pages with a dark terminal-inspired theme.

## Build Commands

### NPM Scripts
```bash
# Development
npm run dev          # Start dev server on http://localhost:4321
npm run start        # Alias for dev

# Production
npm run build        # Static build to ./dist/
npm run preview      # Preview production build locally
```

### Makefile (Alternative - uses pnpm)
```bash
make help            # Show available commands (default)
make install         # Install dependencies
make dev             # Start dev server (localhost only)
make dev-host        # Start dev server on all hosts (for mobile development)
make build           # Build for production
make preview         # Preview production build
make clean           # Clean build artifacts (dist/, .astro/)
```

## Nix Development

```bash
nix develop          # Enter dev shell with Node.js 22
nix run .#dev        # Auto-install deps and start dev server
```

## Project Structure

```
src/
  blog/              # Markdown blog posts (YYYY-MM-DD-slug.md)
  components/        # Astro components (PascalCase.astro)
  layouts/           # Layout components (BaseLayout, PostLayout)
  lib/               # Utility functions (camelCase.ts)
  pages/             # Route definitions ([...slug].astro, index.astro)
  styles/            # Global CSS (Tailwind + custom)
public/              # Static assets
content.config.ts    # Content collections schema
astro.config.mjs     # Astro configuration
```

## TypeScript Conventions

- **Strict mode enabled** - always define types explicitly
- Use explicit return types for exported functions
- Interface naming: `Props` for component props, descriptive names for others
- Type imports: `import type { CollectionEntry } from 'astro:content'`

## Astro Components

### Frontmatter Structure

```astro
---
import Component from '../components/Component.astro';
import { utilFunction } from '../lib/utils';

interface Props {
  title: string;
  optionalProp?: string;
}

const { title, optionalProp = 'default' } = Astro.props;
---
```

### Naming Conventions

- **Components**: PascalCase (e.g., `PostCard.astro`, `BaseLayout.astro`)
- **Utilities**: camelCase (e.g., `utils.ts`, `github.ts`)
- **Routes**: descriptive names or Astro patterns (e.g., `[...slug].astro`)
- **Blog posts**: `YYYY-MM-DD-descriptive-slug.md`

## Styling (TailwindCSS)

### Custom Theme Colors

```
bg          # Background colors
fg          # Text colors (fg, fg-muted, fg-dim)
accent      # Primary green accent
border      # Border colors
category    # Blue for categories
tag         # Amber/gold for tags
date        # Cyan for dates
```

### Class Order Pattern

```html
class="[layout] [spacing] [sizing] [colors] [typography] [effects]"
class="flex items-center gap-3 border border-border bg-bg-secondary p-5 rounded-lg font-mono text-sm text-fg"
```

### Key Principles

- Always use `font-mono` for text
- Dark theme only (`class="dark"` on html element)
- Use custom color tokens, avoid Tailwind defaults
- Prose classes for markdown content styling

## Content Schema

Blog posts use frontmatter with this schema:

```yaml
---
title: "Post Title"
date: YYYY-MM-DD
categories: [category1, category2]
tags: [tag1, tag2, tag3]
comments: true      # default: true
toc: false          # default: false
share: true         # default: true
---
```

## Import Patterns

```typescript
// Built-in Astro imports first
import { getCollection, render } from 'astro:content';
import { ClientRouter } from 'astro:transitions';

// Third-party imports
import { z } from 'astro/zod';

// Local imports (grouped by type)
import BaseLayout from '../layouts/BaseLayout.astro';
import PostCard from '../components/PostCard.astro';
import { formatDate, readingTime } from '../lib/utils';

// Type imports
import type { CollectionEntry } from 'astro:content';
```

## Error Handling

```typescript
// Always handle async operations with try/catch in data fetching
export async function fetchGitHubStats(): Promise<GitHubStats> {
  try {
    const response = await fetch('...');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch GitHub stats:', error);
    return defaultStats;
  }
}
```

## Performance Guidelines

- Use `loading="eager"` for above-fold images
- Use `loading="lazy"` for below-fold images
- Implement Astro View Transitions with `<ClientRouter />`
- Static output mode (`output: 'static'`)

## File Organization

- One component per file
- Co-locate related utilities in `src/lib/`
- Keep components focused and small (<200 lines when possible)
- Use descriptive variable names

## Git Conventions

- Use Conventional Commits format
- Commit messages in English
- Keep commits focused and atomic

## Code Style

- 2-space indentation
- Single quotes for strings
- Semicolons optional but be consistent
- No trailing commas in function parameters
- Max line length: ~100 characters
- Use template literals for string interpolation

## Testing

This project has no automated test suite. Verify changes by:
1. Running `npm run dev` and checking browser
2. Running `npm run build` to ensure no build errors
3. Testing on different screen sizes (responsive design)
