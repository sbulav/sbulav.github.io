---
title: "Neovim writing LUA plugins"
date: 2021-02-22
categories:
  - vim
tags:
  - vim
comments: true
---

Recently the Neovim community has been experiencing a boom in new plugins.
Those plugins are written in LUA, which is much, much more pleasant to write
than VimL.

In this post, I'll share my experience with writing my plugins and share some
suggestions how developer can improve writing experience.

# Theory

Everything you need to know to start your first plugin can be found in
[nvim-lua-guide](https://github.com/nanotee/nvim-lua-guide). It's an
extensive guide to writing Lua in Neovim, covering a large variety of topics. I
had to read it multiple times to wrap my head around it, and kept coming back
to use it as a reference.

# Developer environment

Lua Language server is called `sumneko_lua` and it works like a charm. You can
install language server manually, but I'd recommend using [anott03/nvim-lspinstall](https://github.com/anott03/nvim-lspinstall)

It is a Neovim plugin, and once it's installed, you can simply run `:LspInstall
sumneko_lua`.
Also you have to configure Lua Language Server before you can use it. To do it,
you have two options:
1. use `nvim-lspconfig`, which will provide default LSP configuration for
   `sumneko_lua` server.
2. use `tjdevries/nlua.nvim`, wrapper around `sumneko_lua` LSP, with some
   additions like `gf` on `require`, `K` redirecting you to correct help page
   and other improvements.

Nlua is not polished yet and documentation is lacking, but overall usage
experience is great, so I recommend using it.

Next, you'll probably want to enable automatic completion. For this, I recommend
using [hrsh7th/nvim-compe](https://github.com/hrsh7th/nvim-compe).

Finally, if you like to use Lua REPL, you can check out [bfredl/nvim-luadev](https://github.com/bfredl/nvim-luadev)
or [rafcamlet/nvim-luapad](https://github.com/rafcamlet/nvim-luapad). I haven't
looked deeply into these plugins yet and was using plain Lua REPL.


# The flow

A few not obvious things which can be helpful.

## Include your plugin via local path

I use `packer.nvim`, so configuration can look like:
```vim
  use '~/projects/personal/hover.nvim'
```

With this approach, you don't have to cd deep to `~/.local/share/nvim/site/pack/packer/`
each time you want to change a file. Once development is finished, push changes
to git, and point your Plugin Manager to repository.

## Use modules

On one of the ThePrimeagen twitch streams I heard that it's best practice to 
define your plugin as a module, for example:

```lua
local M = {}

function M.myfunction()

return M
```

With that approach, all functions declared inside module M can be called from
Neovim.

## Inspect values with vim.inspect

It's easy to print object in human readable representation using `vim.inspect`:

```lua
:lua print(vim.inspect(type("test")))
```
This is especially useful when you'd like to see contents of table.

You can check out print output, as well as other messages:
```vim
:messages
```

Check `:h messages` to find out how to interact with this window.

## Use command-line window for complex commands

Editing commands in command line window(:h command-line) is much easier. You can exit
to normal mode, jump where you'd like to, yank, delete, paste and other.

I like the following workflow when editing commands:
1. Press colon (:) and start typing command
2. If I need to edit complex command, press `<C-f>` to open command-line window
3. You can use `/` or `?` to search through command history
4. <CR> to execute, <Esc> to exit command-line

## Reload plugins with [nvim-lua/plenary.nvim](https://github.com/nvim-lua/plenary.nvim)

In Lua, `require` modules are cached. So, when you've updated your plugin you
have to restart vim for new code to work. To do it live, you can use reload
module from
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

To make reloading even quicker, I've set up the following function and
key mapping(inspired by Teej config):

```vim
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

Now when I press `<leader><leader>x`, I either source vim configuration file or
execute Lua one.

## Understand Neovim API functions

At the current moment, Neovim API can be confusing. The same action can be
achieved in many ways, for example:
* vim.api.nvim_command()
* vim.api.nvim_exec()
* vim.call
* vim.cmd
* vim.fn.execute

Some of them don't return output, some execute chunk of code. Refer to
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
and set key mappings.

## Jump-ray

A [jump-ray](https://github.com/sbulav/jump-ray.nvim)

Keep an eye on your Jumplist, in floating window, in LUA.

In this plugin I was playing around with floating windows, autocommands and
parsing Vim command output.

# Conclusion

Vim is a tool that you tune to suit your needs. Using Lua in Neovim lets you tune
almost every aspect of an editor, making it feel and look as you'd like.

The entry barrier for writing Lua plugins is low and it's pretty fun.
There are already a lot of Neovim only plugins and I see that more and more
developers drop vim compatibility and convert to Lua init files.

I am sure that Lua in Neovim has a bright future and it's worth investing into it.

P.S. A list of Lua Neovim plugins can be found [awesome-neovim](https://github.com/rockerBOO/awesome-neovim)
