---
title: "Vim numbered lists"
date: 2023-02-07
categories:
  - vim
tags:
  - vim
comments: true
---

When writing markdown, it's super common that you need numbered lists.
(Neo)Vim has built-in support which makes creating numbered lists like
a breeze.

[Making list of numbers](https://vim.fandom.com/wiki/Making_a_list_of_numbers)
article covers many approaches to creating lists, but it's hard to find
the true gem - automatic numbering.
See `:help v_g_CTRL-A`
```text
{Visual}g CTRL-A	Add [count] to the number or alphabetic character in the
highlighted text. If several lines are highlighted, each one will be
incremented by an additional [count] (so effectively creating a [count]
incrementing sequence).
```

So, let's say you have following text:
  
```markdown
No uppercase, No underscore
3-63 characters long
Not an IP
Must start with lowercase letter or number
Must NOT start with the prefix `xn--`
Must NOT end with the suffix `-s3alias`
```

And you want to turn it into a numbered list. You can do by:
1. Select a visual block of the first symbols in the line, see `:help v_CTRL-V`
2. Press `SHIFT-I` for a visual block insert, see `:help v_b_I`
3. Type `1.` and exit insert mode
4. Reselect the selection by `gv`, see `:gv`
5. Exclude first character by pressing `o`, followed by `j`
5. Automatically increment the numbers by typing `g` followed by `CTRL-A`.


<video src="https://user-images.githubusercontent.com/28604639/150479658-c0ce731f-251d-4f25-a276-da42c0f3e42f.mov" controls="controls" style="max-width: 730px;">
</video>
