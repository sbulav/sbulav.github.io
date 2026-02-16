/**
 * Fetch GitHub profile and repo stats at build time.
 * Falls back to static defaults if the API is unavailable.
 */

// Module-level cache for GitHub stats to avoid multiple API calls during build
let cachedStats: GitHubStats | null = null;

export interface GitHubStats {
  avatarUrl: string;
  followers: number;
  publicRepos: number;
  bio: string;
  topRepos: Array<{
    name: string;
    stars: number;
    description: string;
    url: string;
    language: string;
  }>;
}

const DEFAULTS: GitHubStats = {
  avatarUrl: 'https://avatars.githubusercontent.com/u/28604639?v=4',
  followers: 55,
  publicRepos: 60,
  bio: 'Senior DevOps Engineer\nAWS, Kubernetes, Nix, GitOps',
  topRepos: [
    {
      name: 'calico-policy-visualiser',
      stars: 4,
      description: 'A browser-based tool for Calico NetworkPolicy visualization.',
      url: 'https://github.com/sbulav/calico-policy-visualiser',
      language: 'TypeScript',
    },
    {
      name: 'snacks-tea.nvim',
      stars: 3,
      description: 'A Forgejo/Gitea integration plugin for Neovim',
      url: 'https://github.com/sbulav/snacks-tea.nvim',
      language: 'Lua',
    },
  ],
};

export async function fetchGitHubStats(): Promise<GitHubStats> {
  // Return cached data if available
  if (cachedStats) {
    return cachedStats;
  }

  // Skip GitHub API calls during development to avoid rate limits
  if (import.meta.env.DEV) {
    cachedStats = DEFAULTS;
    return cachedStats;
  }

  try {
    const [profileRes, reposRes] = await Promise.all([
      fetch('https://api.github.com/users/sbulav', {
        headers: { 'User-Agent': 'sbulav-blog-build' },
      }),
      fetch(
        'https://api.github.com/users/sbulav/repos?sort=stars&per_page=10&type=owner',
        { headers: { 'User-Agent': 'sbulav-blog-build' } }
      ),
    ]);

    if (!profileRes.ok || !reposRes.ok) {
      console.warn('GitHub API unavailable, using defaults');
      cachedStats = DEFAULTS;
      return cachedStats;
    }

    const profile = await profileRes.json();
    const repos = await reposRes.json();

    const nonForkRepos = (repos as any[])
      .filter((r: any) => !r.fork && r.stargazers_count > 0)
      .sort((a: any, b: any) => b.stargazers_count - a.stargazers_count)
      .slice(0, 5)
      .map((r: any) => ({
        name: r.name,
        stars: r.stargazers_count,
        description: r.description || '',
        url: r.html_url,
        language: r.language || 'Unknown',
      }));

    cachedStats = {
      avatarUrl: profile.avatar_url,
      followers: profile.followers,
      publicRepos: profile.public_repos,
      bio: profile.bio || DEFAULTS.bio,
      topRepos: nonForkRepos.length > 0 ? nonForkRepos : DEFAULTS.topRepos,
    };
    return cachedStats;
  } catch (e) {
    console.warn('Failed to fetch GitHub stats:', e);
    cachedStats = DEFAULTS;
    return cachedStats;
  }
}
