---
title: "TIL - Pasting into Teams"
date: 2020-04-30
categories:
  - TIL
tags:
  - Teams
comments: true
---

We are using Microsoft Teams as our main collaboration tool.
It was really killing me, when I select and copy text from
Terminal, paste it into Teams chat and receive some weird
looking message:
![Colorized Paste](/assets/images/paste-colored.png)

I was thinking that the issue was related with Microsoft Terminal, but
it turns out it's Teams who paste text with Rich formatting by default.

You can use following shortcuts to control how you paste text:

* `Ctrl + Shift + V` ==> pastes as plain text
* `Ctrl + V` ==> pastes as formatted text
* `Right click -> paste` ==> pastes as formatted text

Or you can enter triple quote ``` to start a code block
and then paste your code there.
