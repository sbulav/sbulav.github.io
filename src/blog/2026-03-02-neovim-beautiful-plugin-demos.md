---
title: "How I record clean GIF demos for Neovim plugins"
date: 2026-03-02
categories:
  - neovim
  - plugins
tags:
  - neovim
  - jira
  - vhs
  - demo
  - automation
comments: true
---

When I released [jira-oil.nvim](https://github.com/sbulav/jira-oil.nvim), I wanted a demo that looked clean and was easy to maintain.

At first it sounded simple: open Neovim, do a few actions, record screen, publish GIF.

In practice, there were three problems:

1. I could not expose real Jira issues from work.
2. Recording a good GIF from a 3840x2560 screen is painful.
3. Manual typing is hard to keep consistent when plugin behavior changes.

This is the workflow I ended up with.

## 1) No personal/work data in recordings

The first blocker was privacy.

I could not publish real project names, issue summaries, links, assignees, or internal structure. Even one accidental frame in a GIF is enough to leak details.

So I built a fake Jira CLI for demo usage: [demo/jira-demo](https://github.com/sbulav/jira-oil.nvim/blob/demo-vhs/demo/jira-demo).

It returns static mock data and behaves like the commands my plugin needs. The demo config points jira-oil.nvim to this fake binary:

```lua
require('jira-oil').setup({
  cli = {
    cmd = vim.fn.getcwd() .. '/demo/jira-demo',
    timeout = 5000,
  },
})
```

This approach is cheap now with LLM agents and scripts. It also gives a nice security property: demo recordings are physically disconnected from real Jira data.

## 2) Isolated Neovim setup for demos

My daily Neovim config is noisy for recordings: many plugins, personal keymaps, local defaults, random popups.

For demos I use a [minimal config](https://github.com/sbulav/jira-oil.nvim/blob/demo-vhs/demo/demo.lua):

```bash
nvim -u demo/demo.lua
```

That file keeps only what I need for recording:

- stable colorscheme
- predictable keymaps
- fixed columns/icons
- plugin autostart on `VimEnter`

This makes every run look almost identical, which matters if you need to re-record later.

## 3) Recording high-resolution terminal demos without pain

Recording directly from a 3840x2560 desktop gave poor results:

- tiny text unless zoomed aggressively
- layout reflow when resizing windows manually
- huge GIF files after export

I switched to [VHS](https://github.com/charmbracelet/vhs). Instead of recording a desktop, VHS renders a terminal scene from a script.

My tape settings look like this:

```text
Set FontSize 18
Set FontFamily "CaskaydiaCove Nerd Font Mono"
Set Padding 12
Set Width 1300
Set Height 650
Set Theme "Catppuccin Mocha"
Set TypingSpeed 70ms
```

Now output dimensions and font rendering are deterministic.

## 4) No more manual typing while recording

Manual typing during recording is fragile.

When features change, you have to type the whole flow again, keep timing in your head, and try not to make mistakes.

VHS solves this too. The tape encodes actions and timing:

```text
Type "nvim -u demo/demo.lua"
Enter
Sleep 3200ms
Type ":%s/Alice Chen/Sam Rivera/g"
Enter
Ctrl+S
Type "Y"
```

So the
[demo](https://github.com/sbulav/jira-oil.nvim/blob/demo-vhs/demo/record.tape)
becomes versioned automation. Updating the scenario is just editing
`demo/record.tape`.

## 5) Final GIF optimization

Even with good recording settings, GIF size still needs tuning.

This command gave me the best tradeoff in practice:

```bash
gifsicle -O3 --lossy=80 -k 64 "demo/jira-oil-demo.gif" -o "demo/jira-oil-demo.optimized.gif"
```

Notes:

- `--lossy=60..120` tunes quality vs size.
- `-k 64` reduces color count and usually cuts size hard.

## Conclusion

For plugin demos, I now treat recording like infrastructure:

- fake data source (no leaks)
- isolated Neovim runtime
- scripted recording with VHS
- deterministic typing and timing
- post-processing with gifsicle

This setup takes a bit more work once, but it saves time every time you ship a new feature.

![jira-oil-demo optimized](https://github.com/user-attachments/assets/fe7dba53-6017-4d99-8e15-dd9fcf4e47ec)
