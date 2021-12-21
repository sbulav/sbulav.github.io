---
title: TIL - Adding mp4 mov to Github markdown files/blog posts
author: Sergei Bulavintsev
date: 2021-12-21
cathegories: [TIL]
lastmod: 2021-12-21
tags: [github]
comments: true
---

In the beginning of 2021, Nat Friedman announced that
`Video files that you drop onto markdown files are now automatically embedded!`

While that sounded pretty cool, there were 2 things which didn't let me try it out:
1. All demos showed that `.mp4` files were added to the README.md, so I thought that I had to convert `.mov` to `.mp4` which is not what I want to spend my time on
2. I thought that I could upload videos only to README.md or wiki.

As it turned out, I was wrong on both points.

Here's a POC Video showing that I can add videos to any markdown file, even to blog posts:

https://user-images.githubusercontent.com/28604639/146938627-beb71c68-b6d6-4d9f-a7eb-2d23c5b95e14.mov

This makes it super convenient to create usage demos, using a native MacOS recording via QuickTime. The only downside for me is
that I have to use web editor for the video uploads.

Here's a quick guide how this can be done on MacOS:
1. Open QuickTime Player. Select `File->New Screen Recording`
2. Record a demo. It will be recorded with the `.mov` extension
3. Create a new markdown file in GitHub.
4. Click on the `edit this file` in the web interface
5. Drag and drop your file into the editing area
6. Video will be automatically converted and new `https://user-images.githubusercontent.com/...` link will be pasted into the markdown file
