---
title: "TIL - Neovim automatic highlighting references with LSP"
date: 2022-01-20
categories:
  - TIL
tags:
  - vim
comments: true
---

Today I learned a pretty cool LSP feature - automatic highlighting of
references for the current text position:

https://user-images.githubusercontent.com/28604639/150479658-c0ce731f-251d-4f25-a276-da42c0f3e42f.mov

To make it work, a few requirements have to be met:
* Your LSP must support such capabilities
* Your colorscheme must support highlight groups defined
* Make it work by introducing autocommands on CursorHold and CursorMoved

See `:h document_highlight` for more details.


Here's an example configuration:
```lua
  -- Set autocommands conditional on server_capabilities
  if client.resolved_capabilities.document_highlight then
    vim.api.nvim_exec(
      [[
      augroup lsp_document_highlight
        autocmd! * <buffer>
        autocmd CursorHold <buffer> lua vim.lsp.buf.document_highlight()
        autocmd CursorMoved <buffer> lua vim.lsp.buf.clear_references()
      augroup END
    ]], false)
  end
```

Unfortunately, my colorscheme of choice,
[OceanicNext](https://github.com/mhartington/oceanic-next), doesn't support
such highlight groups, so I had to migrate to the one with support.

I haven't decided yet which one I'll be using, but so far I have the following
candidates:
* [tokyonight.nvim]( https://github.com/folke/tokyonight.nvim)
* [gruvbox.nvim](https://github.com/ellisonleao/gruvbox.nvim)
* [kanagawa.nvim](https://github.com/rebelot/kanagawa.nvim)
