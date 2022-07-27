---
title: "Neovim opening GitHub repos URLs"
date: 2022-07-27
categories:
  - vim
tags:
  - vim
  - git
comments: true
---

I have a very useful mapping in my Neovim: `gx`, which opens the URL under the
cursor in the browser. I even wrote a blog post on it: [Neovim Opening URLs](https://sbulav.github.io/vim/neovim-opening-urls/)

This blog post is a bit outdated,especially with the newly introduced way of
setting up mappings through `vim.keymap.set`, but still works like a charm.

But there was one missing thing - open GitHub repos of Neovim plugins. For
example, when you're browsing your Packer configuration, plugins looks like
this:

```lua
use {
		"nvim-telescope/telescope.nvim",
		requires = {
				{ "nvim-lua/popup.nvim" },
				{ "nvim-lua/plenary.nvim" },
				{ "nvim-telescope/telescope-github.nvim" },
				{ "kosayoda/nvim-lightbulb" },
				{ "antoinemadec/FixCursorHold.nvim" }
		}
}
```

I've refactored my old solution to do this:
```lua
local function url_repo()
    local cursorword = vim.fn.expand "<cfile>"
    if string.find(cursorword, "^[a-zA-Z0-9.-]*/[a-zA-Z0-9.-]*$") then
        cursorword = "https://github.com/" .. cursorword
    end
    return cursorword or ""
end

local open_command = "xdg-open"
if vim.fn.has "mac" == 1 then
    open_command = "open"
end
vim.keymap.set("n", "gx", function()
    vim.fn.jobstart({ open_command, url_repo() }, { detach = true })
end, attach_opts)
```

Here's the logic:
1. Set the command to open URL based on the OS
2. Get the word under the cursor(`:h expand`)
3. Check if the work looks like `<github_user/reponame>`
4. If yes, add `https://github.com/` to the word under the cursor
5. Set keymap to open the link through the `vim.fn.jobstart`

Overall, I'm pretty happy with how it works:

<video src="https://user-images.githubusercontent.com/28604639/181198693-f62fd6a2-b85f-4662-a89d-a0249f367948.mov" controls="controls" style="max-width: 730px;">
</video>


