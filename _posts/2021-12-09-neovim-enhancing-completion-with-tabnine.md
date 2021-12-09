---
title: Neovim enhancing completion with TabNine
author: Sergei Bulavintsev
date: 2021-12-09
cathegories: 
- vim
lastmod: 2021-12-09
tags:
- vim

---

While everyone is hyped about GitHub's CoPilot, I've discovered
[TabNine](https://www.tabnine.com/), an AI completion that I enjoy a lot.

![tabnine-go](/assets/images/tabnine-go.png)

When CoPilot is aiming to write the whole function for you, TabNine is
intelligently tries to complete just the current line.

Furthermore, the current implementation of
[CoPilot for vim](https://github.com/github/copilot.vim) looks pretty hacky and
doesn't integrate with completion engines, TabNine provides a completion source
for [nvim-cmp](https://github.com/tzachar/cmp-tabnine). Completion is provided
by the local binary(which is installed automatically), so it feels really fast. 

Installation is pretty straightforward and described in
[README](https://github.com/tzachar/cmp-tabnine#install).

In short, following steps are required:
1. Install `hrsh7th/nvim-cmp` nvim completion engine
2. Install `tzachar/cmp-tabnine` nvim-cmp completion source. Under the hood
   installation script will [download and install binary](https://github.com/tzachar/cmp-tabnine/blob/main/install.sh#L28)
3. Configure `nvim-cmp` to use TabNine source, i.e.:
```lua
cmp.setup {
    sources = {
        { name = "buffer" },
        { name = "nvim_lsp" },
        { name = "cmp_tabnine" },
        ...
    },
```
4. Adjust completion menu [to your liking](https://github.com/tzachar/cmp-tabnine#pretty-printing-menu-items)
5. [Setup TabNine](https://github.com/tzachar/cmp-tabnine#setup)

The cool thing here is that TabNine works with any filetype, whether it's GO,
Terraform or even with markdown.

![tabnine-markdown](/assets/images/tabnine-markdown.png)

It's free for individuals, so I highly recommend trying it. If you'll like it,
you can [consider pro options](https://www.tabnine.com/pricing)

You can check out my configuration for:
- [nvim-cmp](https://github.com/sbulav/dotfiles/blob/0dabd397ca572f4a4e354fac5f0e161936c189df/nvim/lua/config/cmp.lua#L42)
- [cmp-tabnine](https://github.com/sbulav/dotfiles/blob/0dabd397ca572f4a4e354fac5f0e161936c189df/nvim/lua/config/cmp_tabnine.lua#L6)
