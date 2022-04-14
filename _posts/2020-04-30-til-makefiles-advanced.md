---
title: "TIL - Makefiles advanced usage"
date: 2020-04-30
categories:
  - TIL
tags:
  - make
  - makefiles
comments: true
---

I'm a long time user of Makefiles.

They're can be really useful to remember, parametrize, and document long
command or chains of commands. I think that Makefiles are underestimated in DevOps
world and thought of something like compilers for C. This is not true and Makefiles
can be useful for anyone(and Vim have native integration with Makefiles as well `:h make`)

I've been using Makefile with just a basic functionalily for a couple years now.
Once I've read a great article [Makefiles in python projects](https://krzysztofzuraw.com/blog/2016/makefiles-in-python-projects.html)
and always thought that it's more than enough for my needs.

But yesterday I found [Automation and Make](https://swcarpentry.github.io/make-novice/)
workshop by Software Carpentry. Never heard of this company before, and course just
popped in my search box.

The course is great, short and precise. If you want to write effective
Makefile, with DRY principles and some magic, give it a go.

Example of magic:
```
## dats        : Count words in text files.
.PHONY : dats
dats : $(DAT_FILES)

%.dat : books/%.txt $(COUNT_SRC)
    $(COUNT_EXE) $< $@
```

I'm thinking about writing an article on Using Makefile for effective developing
of Helm Charts. If you're interested, please let me know.

