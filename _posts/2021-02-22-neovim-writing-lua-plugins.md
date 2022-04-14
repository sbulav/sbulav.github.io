---
title: "Neovim Telescope Github plugin"
date: 2021-06-07
categories:
  - #vim
tags:
  - #vim
  - #github actions
comments: true
---

As an active user and developer of Github Actions, I spend a lot of time
watching how the run goes on and reviewing logs of unsuccessful runs.

So far I had to constantly hop between Neovim and Browser with opened runs.

I was looking into how my workflow can be improved and usage of CLI tool `gh`
was a step in the right direction. But this was not enough.

Neovim [Telescope](https://github.com/nvim-telescope/telescope.nvim) is a great
plugin providing fuzzy findings over all sorts of lists, and it has a large
variety of plugins. One of such plugins is
[telescope-github](https://github.com/nvim-telescope/telescope-github.nvim).

Since workflow runs is a new functionality of GitHub CLI tool is pretty new
functionality at the time of writing, the plugin wasn't supporting it.

I've spent couple of days implementing such support and now it can
[PR 19](https://github.com/nvim-telescope/telescope-github.nvim/pull/19) 
[PR 20](https://github.com/nvim-telescope/telescope-github.nvim/pull/20) :
- Run `Telescope gh run` will open a list of runs, showing status, description,
  workflow, and branch
- Request run rerun
- Open run log, optionally cleaning output
- Monitor unfinished runs, dynamically refreshing window with status
- Open a new tab in browser with run logs

If you're an active user of both Neovim and Github Actions, check it out!

[![out.gif](https://i.postimg.cc/hPLbXJCK/out.gif)](https://postimg.cc/Wh4JK4Ly)
