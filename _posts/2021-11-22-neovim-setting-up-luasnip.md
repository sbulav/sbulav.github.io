---
title: Neovim setting up snippets with luasnip
author: Sergei Bulavintsev
date: 2021-11-22
cathegories: 
- vim
lastmod: 2021-11-22
tags:
- vim

---

I've wanted to start using snippets for a while, but never actually invest time
into figuring out how snippets work. The idea to expand blocks of text/code
just but pressing a few key strokes seems very interesting.

At the time of writing, there's a [good amount of snippet plugins](https://github.com/rockerBOO/awesome-neovim#snippet)
available for Neovim. Since I'm already using [LuaSnip](https://github.com/L3MON4D3/LuaSnip)
for my LSP completion(nvim-cmp), I've decided to stick with this plugin.

Also LuaSnip is very powerful powerful plugin with a lot of features. There are
so many features that it can be difficult to set up. In this blog post,
I'll share how I've configured LuaSnip and will provide a few example snippets
which I use for markdown.

# Installation

To install LuaSnip with packer, following snippet can be used:

 ``` lua
use {
    'L3MON4D3/LuaSnip',
    after = 'nvim-cmp',
    config = function() require('config.snippets') end,
}
 ```
  

To use it with nvim-cmp(as a completion source), you will also have to install
`saadparwaiz1/cmp_luasnip` plugin. So your Packer configuration might look like:

``` lua
-- Installation
use { 
  'hrsh7th/nvim-cmp',
  config = function() require('config.cmp') end,
}
use { 'saadparwaiz1/cmp_luasnip' }
use {
    'L3MON4D3/LuaSnip',
    after = 'nvim-cmp',
    config = function() require('config.snippets') end,
}
```

In the configuration above Packer will run function which will source `cmp.lua`
and `snippets.lua` files in the `config` folder.

Next step is to configure `nvim-cmp` to use LuaSnip as completion engine. I'll
also configure
[Example-mappings](https://github.com/hrsh7th/nvim-cmp/wiki/Example-mappings#luasnip)
which will automatically expand snippet in the LSP menu on selection.

``` lua
cmp.setup({
    ...
    sources = {
        ...
        { name = "luasnip" },
        ...
    },
    mapping = {
        ["<cr>"] = cmp.mapping.confirm(),
        ["<Tab>"] = cmp.mapping(function(fallback)
          if cmp.visible() then
            cmp.select_next_item()
          elseif luasnip.expand_or_jumpable() then
            luasnip.expand_or_jump()
          elseif has_words_before() then
            cmp.complete()
          else
            fallback()
          end
        end, { "i", "s" }),

        ["<S-Tab>"] = cmp.mapping(function(fallback)
          if cmp.visible() then
            cmp.select_prev_item()
          elseif luasnip.jumpable(-1) then
            luasnip.jump(-1)
          else
            fallback()
          end
        end, { "i", "s" }),
        },
    ...
    snippet = {
        expand = function(args)
            local luasnip = prequire("luasnip")
            if not luasnip then
                return
            end
            luasnip.lsp_expand(args.body)
        end,
    },
})

```

## Configuring LuaSnip

To set up our first snippet, we will need to fill luasnip.snippets table with
snippets.

Snippet below will be:
- available for `all` filetypes 
- visible in the LSP menu when you type word `date`
- automatically inserted by hitting enter


``` lua
local ls = require("luasnip")
-- some shorthands...
local snip = ls.snippet
local node = ls.snippet_node
local text = ls.text_node
local insert = ls.insert_node
local func = ls.function_node
local choice = ls.choice_node
local dynamicn = ls.dynamic_node

local date = function() return {os.date('%Y-%m-%d')} end

ls.snippets = {
    all = {
        snip({
            trig = "date",
            namr = "Date",
            dscr = "Date in the form of YYYY-MM-DD"
        },
    }
}
```

For example:

![Snippet before expansion](/assets/images/snip-text-before.png)

Will be expanded to:

![Snippet after expansion](/assets/images/snip-text-after.png)

## Snippets with input parameters

Most of the time, you want insert text and substitute some values in this
text(like function arguments). To do this, you can use 
[Insert Node](https://github.com/L3MON4D3/LuaSnip/blob/master/DOC.md#insertnode),
which will allow you to jump between input parameters.

To do this, let's first define some shortcuts for jumping:

``` lua
local keymap = vim.api.nvim_set_keymap
local opts = { noremap = true, silent = true }
keymap("i", "<c-j>", "<cmd>lua require'luasnip'.jump(1)<CR>", opts)
keymap("s", "<c-j>", "<cmd>lua require'luasnip'.jump(1)<CR>", opts)
keymap("i", "<c-k>", "<cmd>lua require'luasnip'.jump(-1)<CR>", opts)
keymap("s", "<c-k>", "<cmd>lua require'luasnip'.jump(-1)<CR>", opts)
```

Note: we're mapping our jumps in insert mode and in both select and visual mode,
see `:h mapmode-s`

As an example, we will use snippet which will create YAML metadata for
markdown. I use this meta snapshot for my blog posts:

``` lua
snip({
    trig = "meta",
    namr = "Metadata",
    dscr = "Yaml metadata format for markdown"
},
{
    text({"---",
    "title: "}), insert(1, "note_title"), text({"", 
    "author: "}), insert(2, "author"), text({"", 
    "date: "}), func(date, {}), text({"",
    "cathegories: ["}), insert(3, ""), text({"]",
    "lastmod: "}), func(date, {}), text({"",
    "tags: ["}), insert(4), text({"]",
    "comments: true",
    "---", ""}),
    insert(0)
  }),
```

Now when we type `meta`, and pick our snippet, it will be automatically
expanded with the correct `date/lastmod` values. Furthermore, with `ctrl+j` you
can jump to the next input parameter, and with `ctrl+k` backwards without
leaving insert mode. When you'll reach `insert(0)`, snippet will be unlinked.

![InsertNode snippet](/assets/images/snip-insert.png)

What's especially cool is that you can use snippets while you're in the
snippet. For example, to substitute signature while filling the meta snippet:

![InsertNode snippet signature](/assets/images/snip-insert-signature.png)

## Snippets over selected text

Another interesting use case is wrapping selected text with the snippet.

For example, wrapping URL links in markdown files. We will do this using
variable `snip.env.TM_SELECTED_TEXT` and using
[function_node](https://github.com/L3MON4D3/LuaSnip/blob/master/DOC.md#functionnode)
to transform our text.

To populate `*SELECT` variable, we must set key mapping for the
`store_selection_keys`:

``` lua
ls.config.set_config({
  store_selection_keys = '<c-s>',
})
```

Now when we hit `ctrl+s`, current selection will be cleared and you will be
prompted to type the snippet name. 

Our markdown link snippet could look like:

``` lua
snip({
  trig = "link",
  namr = "markdown_link",
  dscr = "Create markdown link [txt](url)"
},
{
  text('['),
  insert(1),
  text(']('),
  func(function(_, snip)
    return snip.env.TM_SELECTED_TEXT[1] or {}
  end, {}),
  text(')'),
  insert(0),
}),
```

It will insert the result of the function into the curly braces and set cursor
into the square brackets for input. 

For example, transferring this link:

![variables snippet](/assets/images/snip-variables.png)

Into markdown format for links:

![variables snippet expanded](/assets/images/snip-variables-expanded.png)

## More

Of course, this is just a basic setup and you can do much, much more with the
snippets. For more information, check out:

- [detailed DOC](https://github.com/L3MON4D3/LuaSnip/blob/master/DOC.md)
- [Examples](https://github.com/L3MON4D3/LuaSnip/blob/master/Examples/snippets.lua)
- [friendly-snippets](https://github.com/rafamadriz/friendly-snippets/tree/main/snippets) contains a lot of snippets which can be used in LuaSnip
- [kickstart.nvim](https://github.com/nvim-lua/kickstart.nvim/blob/master/init.lua) small neovim starter config with LuaSnip configured  
- [my snippets](https://github.com/sbulav/dotfiles/blob/master/nvim/lua/config/snippets.lua)

