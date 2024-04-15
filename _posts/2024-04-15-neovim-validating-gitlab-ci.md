---
title: "Validating Gitlab CI in Neovim"
date: 2024-04-15
categories:
  - vim
tags:
  - vim
comments: true
---

I really enjoyed using
[nvim-jenkinsfile-linter](https://github.com/ckipp01/nvim-jenkinsfile-linter)
when I was writing Jenkinsfiles. Simple yet useful, this plugin helped to speed
up writing Jenkins pipelines as I didn't have to to Jenkins Web UI to check if
my pipeline is correct.

Now I'm writing Gitlab CI, and I couldn't find any plugin with such
functionality for Gitlab. One way was to install [Gitlab
CLI](https://gitlab.com/gitlab-org/cli) and use it to validate the pipeline.
However, for me this was unconvenient.

So I've created a small Neovim plugin to validate Gitlab CI:
[validate-gitlab-ci](https://github.com/sbulav/validate-gitlab-ci.nvim)

<video src="https://github.com/sbulav/validate-gitlab-ci.nvim/assets/28604639/043a421f-3b84-49ec-9588-f6f0ce4d2cb3" controls="controls" style="max-width: 730px;">
</video>


As /CI/lint endpoint is deprecated in Gitlab 16.0 this plugin uses
`/projects/:id/ci/lint` to validate the pipeline.

If you're using Neovim and writing Gitlab pipelines, check it out and maybe you
can find it useful.
