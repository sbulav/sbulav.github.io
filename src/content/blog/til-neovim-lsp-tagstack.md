---
title: "TIL - Neovim lsp uses tag stack"
date: 2022-01-13


---

When you use Neovim LSP functions like `vim.lsp.buf.definition()` or
`vim.lsp.buf.implementation()`, your cursor jumps to the corresponding position.
Your previous position is added to the jumplist. However, if you start jumping
around, your jumplist quickly becomes populated with irrelevant jumps and
you have to type `C-o` multiple times to return to the previous position.

Today I learned that built-in LSP uses Tag Stack `h tag-stack` to track the
positions ONLY when you move via LSP. You can use `C-t` to jump to previous tag(
or in our case position before LSP jump).

There's also a Telescope built-in actions for TagStack, `Telescope tagstack`

p.s. Another interesting thing about LSP, which I learned is that when you
use `vim.lsp.buf.hover()` and, for example, description is too long, you can jump
into the hover window, by running the same `vim.lsp.buf.hover()`.