import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { sortPostsByDate, getPostSlug } from '../lib/utils';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = sortPostsByDate(await getCollection('blog'));

  return rss({
    title: 'Cloud Alchemist',
    description:
      'Personal blog with emphasis on cloud-native technologies, by a Senior DevOps Engineer experienced in AWS, Kubernetes, Terraform, ArgoCD, and NixOS.',
    site: context.site!.toString(),
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      link: `/${getPostSlug(post.id, post.data.categories)}/`,
      categories: post.data.tags,
    })),
    customData: `<language>en-us</language>`,
  });
}
