---
title: "Switch to Colemak"
date: 2021-03-26
categories:
  - #typing
tags:
  - #colemak
  - #layout
comments: true
---

It's been a week since I entirely switched my keyboard layout to [Colemak-DH](https://colemakmods.github.io/mod-dh/).
If you have never heard of it, it's an alternative to QWERTY 12 finger keys
moved.
This move is carefully designed to make typing more comfortable by placing
most used keys on a home row so that your fingers remain on the home row as much
as possible.

I choose Colemak-DH over Dvorak as it's easier to adapt and it let me use some
heavily used shortcuts(like CTRL+X, CTRL+V), which are carved in my muscle
memory.

![colemac-dh](https://colemakmods.github.io/mod-dh/gfx/colemak_dh_main_matrix.png)

In this post, I'll explain why I decide to switch and how I was learning new
layout.

## The Why

I had three reasons to do the switch:

#### Prevent [Repetitive Strain Injury RSI](https://web.eecs.umich.edu/~cscott/rsi.html)

I spend 8-10 hours a day using my computer. During active phases of
development, I can do the typing all that time. Sometimes by the end of the day
I feel the pain. It was worse before I start using an ergonomic keyboard. Using
`Colemak` my fingers tend to move less(especially pinky).

#### Make typing more comfortable

Typing most of the words without having to move your fingers from home row
feels nice. It's hard to describe, but sometimes I feel like my fingers
are flying over the keyboard, not even touching it.

#### Challenge myself

By no means changing keyboard layout is an easy task. It requires hours and
hours of practice, weeks or months during which you'll be less productive than
on QWERTY. I wanted to challenge myself and decide whether the switch is worth
it.


## The How

I never really practiced typing to achieve super speeds, but I had stable 60WPM,
which is more than enough for me. To do the switch, I decide that I will practice
`Colemak` until I'll be comfortable enough and only then use it daily.

I've passed through the following stages:

#### First hours of practice

I didn't have `Colemak-DH` installed in the system and was using [keybr.com](https://www.keybr.com/)
for practice. This site has Colemak layout(not DH mod) emulation and a very
good practice mode. You start with eight letters, and when you learn them(speed
up and do fewer typos), more letters being added one by one.

Another important thing which this site provides is typing statistics. It gives
you feeling that you're moving in the right direction, which improves your
motivation.

At this stage, my typing speed dropped below 20WPM.

#### Installing Colemak-DH to the system

Once you get to the keys which are different in `Colemak` and `Colemak-DH`, you
have to disable emulation and use system layout.

Installation of the new layout is pretty easy and well documented.

It took me 15 hours of practice to get to 40WPM on all letters. I spend one
hour per day practicing and wasn't forcing myself. In the middle, I had a very
strange feeling like my brain and my hands aren't connected anymore. At one
moment I even found myself being unable to type neither in QWERTY nor Colemak.
Hopefully, after an hour my brain was able to sort it out and everything went back
to normal.

![40wpm](/assets/images/colemak-40wpm.png)

#### Switching to `monkeytype`

After I've practiced all the letters, it was time to practice punctuation.
For this, I used [monkeytype](https://monkeytype.com/). I like its quote mode
and overall site style.

Another couple of hours and I had 45 WPM with punctuation enabled which is good
enough for production use

#### Using Colemak daily

Using Colemak daily is both easier and harder than I thought. Doing
plain typing is not a brainer, but there are so many shortcuts that I've practiced
for years. At the moment it's still not easy for me to use shortcuts and requires
`thinking` about it. But every day it's becoming easier and easier to use them

#### Using Vim

That's probably the most difficult thing in the whole switching. I'm a heavy
Vim user and its command mode became hell for me.

After searching through forums, it looks like there are two approaches:
* Remap keys so that you can use your muscle memory. There are even ready plugins
that provide you with [such functionality](https://github.com/theniceboy/nvim)
* Practice new keybindings and maps. I decide that I'll choose this approach
as the new place of `hjkl` aren't that bad and, more importantly, it lets me [GROK](https://gist.github.com/nifl/1178878)

Here's VIM cheatsheet for Colemak-DH:

![Colemak-DH VIM](/assets/images/colemak-vim.png)

## Conclusion

I'm still in the process of learning Colemak, but so far I like the feeling
of typing.
I definitely wouldn't recommend switching for typing switch - you can be as
fast or even faster on QWERTY. But if you want to prevent RSI and feel more
comfortable typing then Colemak is a great option.

You can spend one hour with keyboard emulation and decide if it's worth it for
you.

For me, it's worth the effort.

P.S. This article was written using Colemak in VIM
