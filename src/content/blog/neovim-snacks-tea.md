---
title: "snacks-tea.nvim — Forgejo integration for Neovim"
date: 2026-01-26


---

Lately, I’ve been spending most of my time working with **Forgejo** — a great
self-hosted Git service I use for both personal and work projects.

Since almost all my coding happens inside **Neovim**, I rely heavily on a tight
workflow between my editor and Git hosting. I’ve been using
[folke/snacks.nvim](https://github.com/folke/snacks.nvim) for GitHub
integration, and the experience is fantastic: open PRs, issues, reviews — all
directly from within Neovim.

However, I manage everything on **Forgejo**, not GitHub, so I wanted to
replicate this flow.

Enter **[snacks-tea.nvim](https://github.com/sbulav/snacks-tea.nvim)** — a
small Neovim plugin that wraps around the
[`tea`](https://gitea.com/gitea/tea) CLI to bring Forgejo/Gitea
functionality directly into Neovim.

<img width="3070" height="2196" alt="ss_1769422957" src="https://github.com/user-attachments/assets/3c57db80-101c-4ca0-b817-4fa8fffcda62" />

---

## Motivation

`snacks.gh` provides an elegant GitHub integration via
[`gh`](https://cli.github.com/).  Forgejo has its own command-line tool,
[`tea`](https://gitea.com/gitea/tea), with feature parity for most Git
operations (issues, pull requests, repositories, notifications, etc.).  So the
idea was simple: **keep the same UX and flow from snacks, but swap out the
backend.**

---

## How it Works

`snacks-tea.nvim` is designed as a thin wrapper.  It shells out to `tea` under
the hood, parses the JSON output, and displays the data inside floating Neovim
buffers.

Minimal setup example:

```lua
{
  "folke/snacks.nvim",
  dependencies = {
    "your-username/snacks-tea.nvim"
  },
  opts = {
    tea = {
      enabled = true,
      tea = {
        cmd = "tea",  -- Path to tea binary
        login = nil,  -- Specific login to use (nil = auto-detect)
        remote = "origin",  -- Git remote to use
      },
    }
  }
}
```

Once installed, you can list issues and pull requests directly:

* :TeaPR
* :TeaPRCreate

The plugin reuses the same UI patterns as snacks.gh: floating windows with
preview panes and telescope-like selection.  You can navigate, preview, and
open links straight from Neovim.

Example Flow

1. Browse current Forgejo PRs:
```
:TeaPR
```
2. Press <CR> to open a PR preview.
3. Press <CR> to get a list of available actions on PR(Approve, Checkout, View Diff, etc..)
4. Jump to the repository or PR in the browser if you need full context.

## Why Wrap tea Instead of Re-implementing the API?

Because Forgejo’s REST API is already covered nicely by the tea CLI, which
handles authentication and context selection.  That means snacks-tea.nvim stays
super lightweight — no token management, no custom HTTP code.

## Current Status

For existing PR, plugin handles:

- **View Diff** (`d`) - Open a file-by-file diff viewer with navigation
- **Checkout** (`c`) - `tea pr checkout <number>`
- **Approve** (`A`) - `tea pr approve <number>`
- **Request Changes** - `tea pr reject <number>`
- **Comment** (`a`) - `tea pr comment <number>`
- **Merge** - `tea pr merge <number>`
- **Close** (`x`) - `tea pr close <number>`
- **Reopen** (`o`) - `tea pr reopen <number>`


Also you can create new PR:

<img width="3270" height="1012" alt="ss_1769423937" src="https://github.com/user-attachments/assets/fa2e156a-752f-4f04-877e-770776beed8a" />

## Closing Thoughts

This project is heavily inspired by Folke’s work on snacks.nvim.
The goal isn’t to reinvent the wheel — it’s to extend that same great UX to people who self-host on Forgejo.