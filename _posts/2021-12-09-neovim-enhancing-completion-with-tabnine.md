---
title: Neovim enhancing completion with TabNine
author: Sergei Bulavintsev
date: 2021-12-09
last_modified_at: 2022-01-20
categories: 
- #vim
lastmod: 2021-12-09
tags:
- #vim

---

While everyone is hyped about GitHub's Copilot, I've discovered
[TabNine](https://www.tabnine.com/), an AI completion that I enjoy a lot.

![tabnine-go](/assets/images/tabnine-go.png)

When Copilot is aiming to write the whole function for you, TabNine just
tries to intelligently complete the current line.

Furthermore, the current implementation of
[Copilot for vim](https://github.com/github/copilot.vim) looks pretty hacky and
doesn't integrate with completion engines, while TabNine provides a completion
source [tzachar/cmp-tabnine](https://github.com/tzachar/cmp-tabnine) for
[hrsh7th/nvim-cmp](https://github.com/hrsh7th/nvim-cmp)

Completion is provided by the local binary(which is installed automatically),
so it feels really fast. 

Installation is pretty straightforward and described in
[README](https://github.com/tzachar/cmp-tabnine#install).

In short, following steps are required:
1. Install [hrsh7th/nvim-cmp](https://github.com/hrsh7th/nvim-cmp) nvim
   completion engine
2. Install [tzachar/cmp-tabnine](https://github.com/tzachar/cmp-tabnine)
   nvim-cmp completion source. Under the hood installation script will
   [download and install binary](https://github.com/tzachar/cmp-tabnine/blob/main/install.sh#L28)
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

Enabling PRO version is possible, though not obvious. To do this:
1. Open a new buffer
2. Enter `INSERT` mode
3. Type `TabNine::config`

A new browser window should pop up:

![tabnine-upgrade](/assets/images/tabnine-upgrade.png)

Check [This Issue](https://github.com/tzachar/cmp-tabnine/issues/12) for more info

If you're interested, feel free to check out my config files:
- [nvim-cmp](https://github.com/sbulav/dotfiles/blob/0dabd397ca572f4a4e354fac5f0e161936c189df/nvim/lua/config/cmp.lua#L42)
- [cmp-tabnine](https://github.com/sbulav/dotfiles/blob/0dabd397ca572f4a4e354fac5f0e161936c189df/nvim/lua/config/cmp_tabnine.lua#L6)


## Update 2020-06-09

In [PR #35](https://github.com/tzachar/cmp-tabnine/pull/35) a new command
`:CmpTabnineHub` was introduced.

This command makes in really easy to access the TabNine Hub
