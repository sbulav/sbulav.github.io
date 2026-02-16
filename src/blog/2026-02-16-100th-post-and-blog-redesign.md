---
title: "Post #100 and a full blog redesign"
date: 2026-02-16
categories:
  - blog
tags:
  - blog
  - astro
  - thoughts
comments: true
---

This is the 100th post on this blog. I wrote the first one on April 15, 2020,
mostly to see if I'd stick with it. Turns out I did, almost six years and a
hundred posts later.

To celebrate post 100, I decided to rebuild the entire site from scratch.

## Why redesign now

The blog has been running on Jekyll with the [Minimal Mistakes](https://mmistakes.github.io/minimal-mistakes/) theme since day
one. Jekyll served me well, but over the years I've accumulated enough friction
to justify a move:

- Ruby and Bundler is not in my daily tech stack. To preview the blog, I had to 
  pull a lot of heavy dependencis via Nix.
- After six years design felt old
- I wanted a design that actually felt like mine, not a pre-made template with
  config tweaks.

I'd been hearing good things about [Astro](https://astro.build/) for static
sites, and after a quick prototype it felt right. Fast builds, zero client-side
JavaScript by default, and content collections that handle markdown well.

## From Jekyll to Astro

The [migration itself was
straightforward](https://docs.astro.build/en/guides/migrate-to-astro/from-jekyll/)
. Blog posts stayed as markdown files with the same frontmatter format. I
switched the package manager to pnpm, which is noticeably faster than npm for
my use case.

The biggest difference is how much control I got back. With Jekyll + Minimal
Mistakes, customization meant overriding partials deep inside a gem. With
Astro + TailwindCSS, I write every component from scratch. It's more work
upfront but allows me to customize every aspect of the blog exactly as I'd like to.

The site is now a dark terminal-inspired theme with `font-mono` everywhere.
I wanted it to look like something I'd actually use. If you've seen my [dotfiles](https://github.com/sbulav/dotnix),
you know I spend most of my time in a terminal, so the aesthetic made sense.

## The command bar

My favourite part of the new design is the command bar at the bottom of every
page. I got the idea from [Buildkite's](https://buildkite.com/) interface,
which has a similar command palette. I thought, why not have something like that
on a blog?

You can press `:` or `/` to open it (yes, like vim). From there:

- `:help` shows available commands
- `:tags`, `:categories` navigate to browse pages
- `/search term` does fuzzy search across all posts using Fuse.js
- `:q` hides the bar (of course)
- `Esc` to close the command bar

Tab completion works too. It's a small thing, but it makes navigating the blog
feel natural to me. The bar is hidden by default on mobile since there's no
keyboard, but on desktop it's always visible.

## Comments survived

I've been using [giscus](https://giscus.app/) for comments, backed by GitHub
Discussions. Giscus maps comments to pages by pathname, so as long as I kept
the same URL structure, all existing comments transferred automatically.

I did have to set up proper redirects for the old paginated URLs (`/page2` →
`/page/2`, etc.), but the blog post URLs stayed the same. If you left a comment
on any post before the redesign, it's still there.

## Some numbers

Since the first post, I've written about Kubernetes, Neovim, Nix, Terraform,
certifications, home lab setups, and whatever else I was working on at the time.
Looking at the categories, the split is roughly:

- Kubernetes and infrastructure topics make up the largest chunk
- Neovim and editor workflows come second
- Nix and NixOS grew from zero to a regular topic in the last two years
- TIL (Today I Learned) posts scattered everywhere

The blog started from zero audience, passed 1k unique monthly visitors by the
two-year mark, and kept growing since. Most traffic still comes from organic
search. Some posts, like the Running testcontainers in Kubernetes with KubeDock
and the CKS exam writeup one, keep bringing in readers years after I wrote
them.

## What's next

I'll keep writing. The topics will stay roughly the same: Kubernetes,
infrastructure, Neovim, Nix, and whatever I happen to be debugging or building
at work. I write these posts primarily for myself, as notes I can look up later.
If they help someone else along the way, that's a bonus.

Here's to the next hundred.
