---
title: "Neovim train motions"
date: 2021-01-21
categories:
  - #vim
tags:
  - #vim
comments: true
---

I've found very interesting but little known neovim plugin, [train.nvim](https://github.com/tjdevries/train.nvim).
It's readme is pretty confusing, so I'll describe it here.

## Introduction

Vim movements can be grouped as:
- Left/Right - 'h', 'l', '0', 'gm', 'gM', '^', '$', they move your cursor
  across the line `:h left-right-motions`
- Up/Down - 'k', 'j', 'G', 'gg', 'H', 'M', 'L', they move your cursor up
  or down `:h up-down-motions`
- Word motions - 'w', 'W', 'e', 'E', 'b', 'B', 'ge', 'gE', they move over words
  `:h word-motions`
- Text objects - '(', ')', '[', ']', '{', '}', '[[', ']]', '][', '[]', move over
  text objects i.e. sentence or paragraph `:h object-motions`


What 'train' does, is highlights all these possible motions, drawing small
floating windows with motion key(s), which disappears when you move your cursor.

![train](/assets/images/train.gif)

What's really cool, is that 'train' emulates those possible moves by:
- remember your current position
- jump to move in list
- draw floating window with motion key
- just to initial position

That allows it to emulate every possible motion or set of motion, like '2k{' or
even your own custom motions.

## Usage

To use built-in list of commands, trigger one of:

```
" Train for movements up and down
:TrainUpDown

" Train for movements related to words
:TrainWord

" Train for movements related to text objects
:TrainTextObj
```

If you, for example only want to train paragraph movement, you can define your
own set of motions with:

```
call train#show_matches(['{', '}'])
```

Assign it to mapping for easy trigger, for example to `zx`:

```
nnoremap <silent> zx :call call train#show_matches(['{', '}'])<cr>
```

Sometimes you have to clear floating windows manually. To do this, execute:

```
:TrainClear
```

## Auto trigger train

I like the idea of automatically triggering `train` when I'm in idle for some
tome. With that, when I'm back to work, I see all possible moves on my screen.
To do this, I attach command to `CursorHold` event.

```
" Automatically Trigger Train each 10 sec
augroup auto_show_train
    au!
    setlocal updatetime=10000
    autocmd CursorHold * if &l:buftype !=# 'help' | execute 'normal zx' | endif
augroup end
```
