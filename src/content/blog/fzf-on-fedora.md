---
title: "Setting up FZF on Fedora"
date: 2020-05-06


---

I'm using `fzf` for fuzzy finding in vim, and I am very happy with it.
But for bash in Fedora it was a frustrating experience. Shortcuts weren't
working, bash completion, etc.. Ofcourse it was due to me not reading
carefully through the documentation, but it's sparse and it's easy to
get lost.

That's why I wrote this memo on how to set up FZF on Fedora.

## Install FZF and ripgrep

I didn't want to install fzf from GIT, as most of users probably do.
The benefits of using FZF from official package:
* Don't have to worry about updates
* Cleanier installation
* More stable and tested verstions than from GIT master.

So to install FZF in Fedora:
```bash
sudo dnf install fzf ripgrep
```

## Set up FZF command completions

When you install `fzf` package in Fedora, it drops bash completion script
into system wide directory:
```
/etc/bash_completion.d/fzf
```
To validate that completion is working, reload your session and type `fzf <TAB>`

## Set up key bindings

This was one of the missing gems, which made working with FZF really comfortable.
Open your `~/.bashrc` and add following lines:
```
# FZF mappings and options
[ -f /usr/share/fzf/shell/key-bindings.bash ] && source /usr/share/fzf/shell/key-bindings.bash
```
Reload your session and [Keybindings for CLI](https://github.com/junegunn/fzf#key-bindings-for-command-line)
should be working. Default ones:
- `CTRL-T` - Paste the selected files and directories onto the command-line
- `CTRL-R` - Paste the selected command from history onto the command-line
- `ALT-C` - cd into the selected directory
Check documentation on how to override key-bindings or amend options.

Also make sure that you're familiar with [Fuzzy completion](https://github.com/junegunn/fzf#fuzzy-completion-for-bash-and-zsh)

## Replace default find command with ripgrep

By default, FZF uses `find` command, which is totally fine. But `ripgrep` is much faster,
so why not use it?

Add line below to your `~/.bashrc` to match all files, including hidden ones:
```
export FZF_DEFAULT_COMMAND='rg --files --no-ignore --hidden --follow --glob "!.git/*"'
```
Or, to exclude hidden files and respect .gitignore:
```
export FZF_DEFAULT_COMMAND='rg --files'
```

## Set up preview in bash

One cool feature that FZF has, is that you can preview files during search.
I'm using [bat](https://github.com/sharkdp/bat) for preview functionality.
Actually, I've totally replaced cat with `bat -p` alias. I used fzf
default options from [samoshkin dotfiles](https://github.com/samoshkin/dotfiles/blob/bc517ba40c4311acefa40a5e92591c28b484ad12/variables.sh#L71)
as source for inspiration.

```
export FZF_DEFAULT_OPTS="--height 50% -1 --layout=reverse-list --multi --preview='[[ \$(file --mime {}) =~ binary ]] && echo {} is a binary file || (bat --style=numbers --color=always {} || cat {}) 2> /dev/null | head -300'"
```

## Tune FZF behaviour as you'd like

There's a ton of possibilities to tune appearance, mappings, aliases, etc..
Make sure to check [FZF Examples](https://github.com/junegunn/fzf/wiki/examples)
And don't forget to configure FZF in VIM - it's super-awesome!