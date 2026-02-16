/**
 * Generate the Jekyll-compatible slug for a blog post.
 * Jekyll pattern: /:categories/:title/
 * The title slug comes from the filename (after date prefix), not the title field.
 */
export function getPostSlug(postId: string, categories: string[]): string {
  // postId from glob loader is the filename without extension, e.g. "2020-04-15-initial-post"
  const titleSlug = postId.replace(/^\d{4}-\d{2}-\d{2}-/, '');
  const catPath = categories.map((c) => c.toLowerCase()).join('/');
  return catPath ? `${catPath}/${titleSlug}` : titleSlug;
}

/**
 * Format a date as YYYY-MM-DD
 */
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Format a date as "Month DD, YYYY"
 */
export function formatDateLong(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Estimate reading time from text content
 */
export function readingTime(text: string): number {
  const wordsPerMinute = 200;
  const words = text.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

/**
 * Get all unique tags from posts with counts
 */
export function getTagCounts(
  posts: Array<{ data: { tags: string[] } }>
): Map<string, number> {
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.data.tags) {
      const normalized = tag.toLowerCase();
      counts.set(normalized, (counts.get(normalized) || 0) + 1);
    }
  }
  return new Map([...counts.entries()].sort((a, b) => b[1] - a[1]));
}

/**
 * Get all unique categories from posts with counts
 */
export function getCategoryCounts(
  posts: Array<{ data: { categories: string[] } }>
): Map<string, number> {
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const cat of post.data.categories) {
      const normalized = cat.toLowerCase();
      counts.set(normalized, (counts.get(normalized) || 0) + 1);
    }
  }
  return new Map([...counts.entries()].sort((a, b) => b[1] - a[1]));
}

/**
 * Sort posts by date descending
 */
export function sortPostsByDate<T extends { data: { date: Date } }>(
  posts: T[]
): T[] {
  return [...posts].sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
  );
}

/**
 * Group posts by year
 */
export function groupPostsByYear<T extends { data: { date: Date } }>(
  posts: T[]
): Map<number, T[]> {
  const groups = new Map<number, T[]>();
  for (const post of posts) {
    const year = post.data.date.getFullYear();
    if (!groups.has(year)) groups.set(year, []);
    groups.get(year)!.push(post);
  }
  return new Map([...groups.entries()].sort((a, b) => b[0] - a[0]));
}
