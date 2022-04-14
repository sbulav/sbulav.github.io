---
title: "TIL - Neovim automatically wrapping long lines"
date: 2020-07-20
categories:
  - #TIL
tags:
  - #vim
comments: true
---

While editing markdown files, I try to make them nicely formatted. For me, 80
characters is a good line length. Wrapping text can be boring, especially on
already written long non-formatted texts.

Recently I've figured out a few tricks on how to work with such texts.

## Highlighting 80 characters with colorcolumn

You can highlight column with `:h colorcolumn` and pick color with
`hl-ColorColumn`, but I'm fine with standart one.

Since I don't use F1 key I've mapped it to toggle column on and off both in
insert and in normal mode.
This mapping doesn't work in visual mode, so I've just remapped it to escape:

```

inoremap <silent> <F1> <ESC>:execute "set colorcolumn=" . (&colorcolumn == "" ? "81" : "")<CR>a
nnoremap <silent> <F1> :execute "set colorcolumn=" . (&colorcolumn == "" ? "81" : "")<CR>
vnoremap <F1> <ESC>
```

That gives me:

![Highlight colorcolumn](/assets/images/neovim-highlight-colorcolumn.gif)

## Automatically formatting and wrapping text

(Neo)vim is able to automatically format and wrap text. It's very powerful, but
I only wanted to use auto-wrap functionality.

To use it, check following things:
* Check or set to 80 textwidth `:set textwidth=80`, could be already set by
filetype plugin
* Check that auto-wrap using the text width `t` is in formatoptions `:h
formatoptions`
* If you want vim to re-format automatically every time text is inserted or
deleted, `set fo+=a`, `:h autoformat`.
* To manually format block of code, use `gq{motion}`, `:h gq`

Using `gq` I can quickly and controllably format blocks of text:

![Highlight colorcolumn](/assets/images/neovim-text-format.gif)
