---
title: "TIL - Neovim automatic highlighting references with LSP"
date: 2022-01-20
last_modified_at: 2022-05-16
categories:
  - TIL
tags:
  - vim
comments: true
---

Today I learned a pretty cool LSP feature - automatic highlighting of
references for the current text position:

<video src="https://user-images.githubusercontent.com/28604639/150479658-c0ce731f-251d-4f25-a276-da42c0f3e42f.mov" controls="controls" style="max-width: 730px;">
</video>

To make it work, a few requirements have to be met:
* Your LSP must support such capabilities
* Your colorscheme must support highlight groups defined
* Make it work by introducing autocommands on CursorHold and CursorMoved

See `:h document_highlight` for more details.


Here's an example configuration for NeoVim 0.7+:
``` lua
    -- Server capabilities spec:
    -- https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#serverCapabilities
    if client.server_capabilities.documentHighlightProvider then
        vim.api.nvim_create_augroup("lsp_document_highlight", { clear = true })
        vim.api.nvim_clear_autocmds { buffer = bufnr, group = "lsp_document_highlight" }
        vim.api.nvim_create_autocmd("CursorHold", {
            callback = vim.lsp.buf.document_highlight,
            buffer = bufnr,
            group = "lsp_document_highlight",
            desc = "Document Highlight",
        })
        vim.api.nvim_create_autocmd("CursorMoved", {
            callback = vim.lsp.buf.clear_references,
            buffer = bufnr,
            group = "lsp_document_highlight",
            desc = "Clear All the References",
        })
    end
```

Or for the older versions:
```lua
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
