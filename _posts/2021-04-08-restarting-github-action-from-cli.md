---
title: "Restarting GitHub action from CLI"
date: 2021-04-08
categories:
  - #TIL
tags:
  - #github
  - #github actions
comments: true
---

GitHub Actions is still pretty new and missing a lot of functionality. One of
such missing features was the ability to interact with Actions from the command
line.

`gh` is the CLI for GitHub and for GitHub Actions. 

With the latest `gh` release (1.8.1 at the time of writing), developers added
[gh rerun](https://github.com/cli/cli/commit/216cfb631f6d1b34e7fc0529344fa367faee59c6)
support. While this feature is not yet in documentation, and not all runs can be
restarted(I'm receiving the error `its workflow file may be broken`), it's already
a great productivity booster for me. Here's how I use it:

```bash
# Find out required run <id>
$> gh run list

# Rerun failed pipeline
$> gh run rerun <id>
✓ Requested rerun of run <id>
```
