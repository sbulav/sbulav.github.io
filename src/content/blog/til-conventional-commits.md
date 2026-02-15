---
title: "TIL - Conventional Commits"
date: 2021-11-30
categories:
  - TIL
tags:
  - git
---

In my daily work, I try to use sane commits messages. 

Here's a typical example of my commit messages:

```text
Bump addressable from 2.7.0 to 2.8.0
Add post on helm testing with custom values
Add slow pv mount article
Fix grammer article
Add article on using argo with ACR
Replace Github secret names with env
```

While they're make sense, there's a better approach to writing commit messages.

Today I learned that there's a whole specification for writing [Conventional
Commits](https://www.conventionalcommits.org/en/v1.0.0/). They provide a nice
and lightweight convention, which everyone can easily adopt in their workflow.
What's even more cooler, there's a set of utilities(called
[standard-version](https://github.com/conventional-changelog/standard-version)
which can be used for linting commits, SEMVER versioning based on the text in
the commit and even generating CHANGELOG for you.

I will definitely try to use this specification and encourage you to at least
give it a thought.