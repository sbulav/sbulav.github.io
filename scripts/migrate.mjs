import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const projectRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceDir = path.join(projectRoot, '_posts');
const destDir = path.join(projectRoot, 'src/content/blog');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const files = fs.readdirSync(sourceDir).filter(f => f.endsWith('.md'));

for (const file of files) {
  const content = fs.readFileSync(path.join(sourceDir, file), 'utf-8');
  
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) continue;
  
  const frontmatter = frontmatterMatch[1];
  const body = content.slice(frontmatterMatch[0].length).trim();
  
  const frontmatterObj = {};
  const categories = [];
  const tags = [];
  
  frontmatter.split('\n').forEach(line => {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) return;
    
    const key = line.slice(0, colonIdx).trim();
    let value = line.slice(colonIdx + 1).trim();
    
    if (key === 'title') {
      frontmatterObj.title = value.replace(/^["']|["']$/g, '');
    } else if (key === 'date') {
      const dateMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
      if (dateMatch) {
        frontmatterObj.date = `${dateMatch[1]}-${dateMatch[2]}-${dateMatch[3]}`;
      }
    } else if (key === 'categories') {
      const arrMatch = value.match(/^\[([^\]]*)\]$/);
      if (arrMatch) {
        const parsed = arrMatch[1].split(',').map(s => s.trim()).filter(Boolean);
        parsed.forEach(c => {
          if (c) categories.push(c);
        });
      }
    } else if (key === 'tags') {
      const arrMatch = value.match(/^\[([^\]]*)\]$/);
      if (arrMatch) {
        const parsed = arrMatch[1].split(',').map(s => s.trim()).filter(Boolean);
        parsed.forEach(t => {
          if (t) tags.push(t);
        });
      }
    }
  });
  
  let slug = file.replace('.md', '');
  const dateMatch = slug.match(/^(\d{4}-\d{2}-\d{2})-(.+)$/);
  if (dateMatch) {
    slug = dateMatch[2];
  }
  slug = slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  
  let categoriesStr = '';
  if (categories.length > 0) {
    categoriesStr = 'categories:\n' + categories.map(c => `  - ${c}`).join('\n');
  }
  
  let tagsStr = '';
  if (tags.length > 0) {
    tagsStr = 'tags:\n' + tags.map(t => `  - ${t}`).join('\n');
  }
  
  const title = frontmatterObj.title || slug;
  const date = frontmatterObj.date || new Date().toISOString().split('T')[0];
  
  const newFrontmatter = `---
title: "${title}"
date: ${date}
${categoriesStr}
${tagsStr}
---

${body}`;
  
  fs.writeFileSync(path.join(destDir, `${slug}.md`), newFrontmatter);
  console.log(`Migrated: ${file} -> ${slug}.md`);
}

console.log(`\nDone! Migrated ${files.length} posts.`);
