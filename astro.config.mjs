import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://sbulav.github.io',
  output: 'static',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    sitemap(),
  ],
  markdown: {
    shikiConfig: {
      theme: 'github-dark-default',
      wrap: true,
    },
  },
  redirects: {
    '/page2/': '/page/2/',
    '/page3/': '/page/3/',
    '/page4/': '/page/4/',
    '/page5/': '/page/5/',
    '/page6/': '/page/6/',
    '/page7/': '/page/7/',
    '/page8/': '/page/8/',
    '/page9/': '/page/9/',
    '/page10/': '/page/10/',
    '/page11/': '/page/11/',
    '/page12/': '/page/12/',
    '/page13/': '/page/13/',
    '/page14/': '/page/14/',
    '/page15/': '/page/15/',
    '/page16/': '/page/16/',
    '/page17/': '/page/17/',
    '/page18/': '/page/18/',
    '/page19/': '/page/19/',
    '/page20/': '/page/20/',
  },
});
