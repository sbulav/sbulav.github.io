---
title: "Neovim writing LUA plugins"
date: 2021-02-22
categories:
  - vim
tags:
  - vim
comments: true
---

Recently the neovim community has been experiencing a boom in new plugins. Those plugins are written in LUA, which is much, much more pleasant that VimL.

In this post I'll share my experience with writing my own plugins and share some
suggestions how developer can improve writing experience.

# Theory

Everything you need to know to start your first plugin can be found in
[nvim-lua-guide](https://github.com/nanotee/nvim-lua-guide). It's an
extensive guide to writing Lua in Neovim, covering large variety of topics. I
had to read it multiple times to wrap my head around it, and kept coming back
to use it as a reference.

# Developer environment

Lua Language server is called `sumneko_lua` and it works like a charm. You can
install language server manually, but I'd recommend using [anott03/nvim-lspinstall](https://github.com/anott03/nvim-lspinstall)

It is a Neovim plugin, and you can simply run `:LspInstall sumneko_lua`
Once Language server is installed, you need to configure it. Two options:
1. use `nvim-lspconfig`, which will provide default configuration for
   `sumneko_lua` server.
2. use `tjdevries/nlua.nvim`, wrapper around `sumneko_lua`, with some additions
   like `gf` on `require`, `K` redirecting you to correct help page and other
   improvements.

Nlua is not polished yet and documentation is lacking, but the experience is
great.

Next you'll probably want Automatic completion. I recommend using
[hrsh7th/nvim-compe](https://github.com/hrsh7th/nvim-compe).

Finally, if you like to use REPL, you can check out [bfredl/nvim-luadev](https://github.com/bfredl/nvim-luadev)
or [rafcamlet/nvim-luapad](https://github.com/rafcamlet/nvim-luapad). I haven't
looked deeply into these plugins yet, and was using plain `lua` REPL.


# The flow

A few not obvious things which can be helpful:
## Include your plugin via local path.

I use `packer.nvim`, so configuration can look like:
```vim
  use '~/projects/personal/hover.nvim'
```

## Use modules.

On one of ThePrimeagen twitch streams I heard that it's best practice to use
modules, for example:
```LUA
local M = {}

function M.myfunction()

return M
```
With that approach, all functions declared inside module M can be called from
Nvim.

## Reload plugins with [nvim-lua/plenary.nvim](https://github.com/nvim-lua/plenary.nvim)

In Lua, `require` modules are cached. So, when you've updated your plugin you
have to restart vim in order for new code to work. To do it live, you can use
reload module from
[plenary/reload.lua](https://github.com/nvim-lua/plenary.nvim/blob/master/lua/plenary/reload.lua).

```Lua
:lua require("plenary.reload").reload_module'module_name`
```

## Use luafile

Use `luafile` to execute a Lua file you are working on. For example, to call
function mentioned above, you can do something like that:

```LUA
M.myfunction()
```

and then run `luafile %`. `M.myfunction` will be executed and you'll see your
output.

To make reloading even quicker, I've have set up following function and
keymap(imspired by Teej config):

```viml
" Execute this file
function! s:save_and_exec() abort
  if &filetype == 'vim'
    :silent! write
    :source %
  elseif &filetype == 'lua'
    :silent! write
    :lua require("plenary.reload").reload_module'%'
    :luafile %
  endif

  return
endfunction
" save and resource current file
nnoremap <leader><leader>x :call <SID>save_and_exec()<CR>
```

Now when I press `<leader><leader>x`, lua file get executed.


## Understand Nvim API functions

At current moment, Nvim API can be confusing. The same action can be achieved
in many ways, for example:
* vim.api.nvim_command()
* vim.api.nvim_exec()
* vim.call
* vim.cmd
* vim.fn.execute

Some of the don't return output, some execute chunk of code. Refer to
nvim-lua-guide and help pages to clarify and find suitable function.

# My plugins

I've written two small plugins for fun and learning purposes. You can look at
their code to understand how you can start with your plugin.

## Nredir

A [nredir](https://github.com/sbulav/nredir.nvim) Redirect the output of a Vim
or external command into a scratch buffer, in LUA.
It's basically an implementation of [Romainl's Redir](https://gist.github.com/romainl/eae0a260ab9c135390c30cd370c20cd7),
written for learn purposes in Lua.

Here I was learning how you can execute Vim commands, create new buffers/windows
and set keymappings.

## Jump-ray

A [jump-ray](https://github.com/sbulav/jump-ray.nvim)

Keep an eye on your Jumplist, in floating window, in LUA.

In this plugin I was playing around with floating windows, autocommands and
parsing Vim command output.

# Conclusion

TBD
