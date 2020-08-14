---
title: "Switch to fish shell"
date: 2020-08-03
categories:
  - fish
tags:
  - fish
  - shell
comments: true
---

I had some free time and decide that I should try different shell, specifically
fish. I wanted to try it for a long time, but just wasn't convinced that time
investment worth it.

But the setup went pretty well, quickly I was able to make it work good enough
to make it default shell for my user. After two days I was convinced that switch
is worth it and I've transferred all of my aliases and custom function.

So there's what hooked me:
* Autosuggestions - fish suggests commands as you type, and shows the suggestion
to the right of the cursor, in gray. You can accept all the command from the
suggestion with `ctrl+f` or `right` or one word `ctrl+right`.
![fish suggestions](/assets/images/fish_suggestions.png)
* Smart autocompletion - fish tries to complete command, argument, or path. Some
commands, like `git`, have even better intellectual completion. If you're
receiving a lot of variants, you can sort them with `ctrl+s`
![fish autocompletion](/assets/images/fish-smart-completion.png)
* Git prompt - out of the bot fish provides[git-prompt](https://fishshell.com/docs/current/cmds/fish_git_prompt.html)
with a lot of customization options, like showing number of untacked file,
uncommited changes, shortening branch name and many many more
![fish autocompletion](/assets/images/fish-smart-completion.png)
* History - fish stores all the history with massive 260k entries by default.
* Path abbreviation - if your current path is deep enough, fish will shorten
some of the path, so `~/dotfiles/fish` will become `~/d/fish`.
* Ease of creating keymappings - awesome command `bind` will let you create
fish mappings on-the-fly.
![fish bindings](/assets/images/fish-bindings.png)
* Smart ** expansion - you could type `**.fish` to match files in the PWD
as well as subdirectories
![fish star expansion](/assets/images/fish-star-expansion.png)
* Ease of personalization and customization - a lot of tunable variables to
define look and behaviour of fish already there. Just set relevant variable
or install theme.
* fish-config - utility to open web page, where you can preview your visual
changes, behaviour; Examing functions and keybindings.
* Plugin manager - using `fisher` or `oh-my-fish` you can easily install
utilities, completions, themes.
* Overall purity - fish is very well thought, overall configuration look clean,
every command or function is in it's own file, directory structure is intuitive.

Of course, there's some downsides:
* Own syntax - not much differences, but you have to get used to it. For example,
instead of `command` you have to use (command).
* Lack of completions for commands - some tools, like `kubectl`, don't provide
completions. Luckily, community provides completions for the most popular ones,
or you can always write you own :-).
* Lags or delays - sometimes it feels not as fast as bash. Mostly on processing
large amount of texts. Maybe it's some configuration or built-in PAGER issues.

I'm pretty happy with the switch and don't look back.
