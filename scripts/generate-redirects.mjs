import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const projectRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const blogDir = path.join(projectRoot, 'src/content/blog');
const outputFile = path.join(projectRoot, 'public/_redirects');

const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.md'));

let redirects = `# Auto-generated redirects from Jekyll to Astro
# Old format: /:categories/:title/ -> /posts/:slug/

# Static pages
/categories /categories/ 301
/tags /tags/ 301
/about /about/ 301
/feed.xml /rss.xml 301
/posts-ideas /about 301

# Calico visualizer
/calico-visualiser /calico-visualiser/index.html 301
`;

files.forEach(file => {
  const slug = file.replace('.md', '');
  
  // Read the file to get categories
  const content = fs.readFileSync(path.join(blogDir, file), 'utf-8');
  const categoryMatch = content.match(/categories:\s*\n\s*-\s*(\S+)/);
  const category = categoryMatch ? categoryMatch[1] : 'blog';
  
  // Old URL: /:category/:title/
  const oldUrl = `/${category}/${slug}`;
  const newUrl = `/posts/${slug}/`;
  
  redirects += `${oldUrl} ${newUrl} 301\n`;
});

fs.writeFileSync(outputFile, redirects);
console.log(`Generated ${files.length} redirects`);
