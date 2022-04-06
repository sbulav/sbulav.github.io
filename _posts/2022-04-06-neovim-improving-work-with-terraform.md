---
title: "Improving work with Terraform in Neovim"
date: 2022-01-20
categories:
  - vim
tags:
  - vim
comments: true
---

Working with Terraform on a daily basis and using Neovim as my main
and only editor, I recently figured out a few improvements, which
I'll share in this blog post.

## Correctly detecting TF filetype

Many users of NeoVim use [filetype.nvim](https://github.com/nathom/filetype.nvim),
which replaces native filetype detection and speeds up Neovim startup. If you
use [vim-terraform](https://github.com/hashivim/vim-terraform), which also
provides filetype detection, detection from filetype.nvim will be used.

However, it detects `*.tf` files as files with `tf` filetype. Due to this,
Treesitter does not recognize those files and you're missing all those juicy
highlights.

Compare those two screenshots:

With filetype set as `tf`:

With filetype set as `terraform`(I also have p00f/nvim-ts-rainbow installed):

Fortunately, filetype.nvim provides a way to override the filetype detection:

```lua
use {
    "nathom/filetype.nvim",
    config = function()
        require("filetype").setup {
            overrides = {
                extensions = {
                    tf = "terraform",
                    tfvars = "terraform",
                    tfstate = "json",
                },
            },
        }
    end,
}
```

## Getting rid of the vim-terraform

[vim-terraform](https://github.com/hashivim/vim-terraform) provides filetype
detection, syntax highlighting, auto-formatting and some other features.
As mentioned above, filetype detection is overriden by the `filetype.nvim`,
syntax highlighting is done by Treesitter, and auto-formatting can be done
by the [null-ls](https://github.com/jose-elias-alvarez/null-ls.nvim):

```lua
local null_ls = require "null-ls"
local b = null_ls.builtins

local sources = {
    b.formatting.terraform_fmt,
    ...
}

```

If you'll use both `filetype.nvim` and `vim-terraform`, you'll be formatting
terraform files twice on each save.

## Adding Tabnine and CoPilot

To speed up writing Terraform files, I'm using [TabNine](https://sbulav.github.io/vim/neovim-enhancing-completion-with-tabnine/).
It works great, but you can go even further and combine it with CoPilot.

With the recently introduced [copilot.lua](https://github.com/zbirenbaum/copilot.lua)
and the completion source [copilot-cmp](https://github.com/zbirenbaum/copilot-cmp),
writing Terraform files is now as easy as writing Go code:

