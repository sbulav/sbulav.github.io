---
title: "Git fzf wrappers for fish"
date: 2021-04-12


---

I was reading through the list of changes of new `fzf` version and, as it sometimes
happened, found myself in a different place.

This time, it was [Key bindings for git with fzf](https://gist.github.com/junegunn/8b572b8d4b5eddd8b85e5f4d40f17236)
Gist.

Unfortunately, since I'm using fish, those functions didn't work for me and
I've to adapt them to fish. Also, I added a couple of `fzf` wrappers of `gh` CLI
tool.

Here's the list of functions:
```bash
8:function gf -d "Show modified files in GIT directory"
26:function gb -d "Show branches and list of branch commits in GIT directory"
37:function gt -d "Show list of tags in GIT directory"
44:function ghh -d "Show commit history and selected commit diff"
53:function gr -d "Show list of existing git remotes"
61:function ghi -d "Github: View Open Issues"
69:function ghprl -d "Github: View Open PRs"
77:function ghprr -d "Github: View Open PRs needing my review"
```

And here's [url to fish functions](https://github.com/sbulav/dotfiles/blob/8bbd47ead282a851307812cc762ee783bfb66025/fish/functions/functions.fish)
maybe someone will find them useful.