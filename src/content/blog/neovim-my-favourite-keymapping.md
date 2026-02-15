---
title: "Vim my favourite keymapping"
date: 2021-04-02


---

I don't think that there is a single person who likes Vim's `Ex` mode.
And keymapping used to trigger this shortcut, `Q` regularly gets occasionally
triggered.

A lot of people unmap it to prevent accidentally entering `Ex` mode, but for
myself I found a better solution:
```vim
nnoremap Q :quit<cr>
```

This keymap:
* Lets me close any window,including help pages, Fugitive windows or even Vim
  in a consistent way
* Feels very natural, easy to remember
* Easy to trigger

Since I've mapped it, I use it all the time. Give it a try, maybe you'll find it
as useful as I do.