---
title: "TIL - Neovim Highlight yanked text"
date: 2020-05-25
categories:
  - TIL
tags:
  - vim
comments: true
---

I have a bad habit of visually selecting text in (neo)vim before yanking it.
I know that it's not efficient and always wanted to get rid of this habit.

Neovim has merged cool [PR](https://github.com/neovim/neovim/pull/12279) that I
hope could help me - hightlight on yank.

If you're on Neovim v0.5.0-519+, you can set up something like:

```
" Highlight yanked text in neovim
if exists('##TextYankPost')
    autocmd TextYankPost * silent! lua require'vim.highlight'.on_yank('IncSearch', 1500)
endif
```

To achieve:
![TextYankPost](/assets/images/neovim-yank-highlight.gif)
