import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  
  return rss({
    title: 'Cloud Alchemist',
    description: 'Personal blog with emphasis on cloud-native technologies, by a Senior DevOps Engineer experienced in AWS, Kubernetes, Terraform, ArgoCD, and NixOS.',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description || '',
      link: `/posts/${post.slug}/`,
    })),
    customData: `<language>en-us</language>`,
  });
}
