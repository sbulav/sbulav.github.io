---
title: "Neovim opening URLs"
date: 2021-02-08
categories:
  - vim
tags:
  - vim
comments: true
---

Vim has built-in functionality to open URLs directly by executing `gx` in normal
mode. This functionality is provided by netrw plugin `:h netrw-gx`

However, in MacOS this functionality is buggy or don't work at all, see
[Related BUG](https://github.com/vim/vim/issues/4738).
Furthermore, if you're using different from netrw file browser(for example I use
nvim-tree), there's a good chance that whole netrw plugin is explicitly
disabled.

But you can reproduce `gx` functionality pretty easy(I'll show the pure Lua
version as I'm using Neovim):

```Lua
local map = require('utils').map

-- URL handling
if vim.fn.has("mac") == 1 then
  map[''].gx = {'<Cmd>call jobstart(["open", expand("<cfile>")], {"detach": v:true})<CR>'}
elseif vim.fn.has("unix") == 1 then
  map[''].gx = {'<Cmd>call jobstart(["xdg-open", expand("<cfile>")], {"detach": v:true})<CR>'}
else
  map[''].gx = {'<Cmd>lua print("Error: gx is not supported on this OS!")<CR>'}
end
```

Kudos for original solution to [nanotee](https://github.com/nanotee), and find
Lua mapping function in 
[Nanotee dotfiles](https://github.com/nanotee/dotfiles/blob/master/.config/nvim/lua/my/utils/init.lua#L29)
