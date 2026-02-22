import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import {
  getCategoryCounts,
  getPostSlug,
  getTagCounts,
  sortPostsByDate,
} from '../lib/utils';

export const prerender = true;

const POSTS_PER_PAGE = 5;

function encodePath(path: string): string {
  return path
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');
}

function buildXml(urls: string[]): string {
  const items = urls
    .map(
      (url) => `  <url>\n    <loc>${url}</loc>\n  </url>`
    )
    .join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    items,
    '</urlset>',
    '',
  ].join('\n');
}

export const GET: APIRoute = async ({ site }) => {
  if (!site) {
    return new Response('Missing site URL', { status: 500 });
  }

  const posts = await getCollection('blog');
  const sortedPosts = sortPostsByDate(posts);
  const totalPages = Math.ceil(sortedPosts.length / POSTS_PER_PAGE);

  const urls = new Set<string>();
  const baseUrl = site.href.endsWith('/') ? site.href : `${site.href}/`;

  const addPath = (path: string): void => {
    const normalized = path.replace(/^\//, '');
    urls.add(new URL(normalized, baseUrl).href);
  };

  addPath('/');
  addPath('/about/');
  addPath('/posts/');
  addPath('/categories/');
  addPath('/tags/');

  for (let page = 2; page <= totalPages; page += 1) {
    addPath(`/page/${page}/`);
  }

  for (const post of sortedPosts) {
    const slug = encodePath(getPostSlug(post.id, post.data.categories));
    addPath(`/${slug}/`);
  }

  const categoryCounts = getCategoryCounts(posts);
  for (const category of categoryCounts.keys()) {
    addPath(`/categories/${encodeURIComponent(category)}/`);
  }

  const tagCounts = getTagCounts(posts);
  for (const tag of tagCounts.keys()) {
    addPath(`/tags/${encodeURIComponent(tag)}/`);
  }

  const xml = buildXml([...urls]);

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
