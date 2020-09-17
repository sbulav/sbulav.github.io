---
title: "Passed RedHat PE180 exam"
date: 2020-09-16
categories:
  - certifications
tags:
  - redhat
  - pe180
comments: true
---

I have successfully passed Red Hat PE180 and earn [Red Hat Certified Specialist
in Containers for
Kubernetes](https://rhtapps.redhat.com/verify/?certId=160-186-458). In this post
I will share my experience about motivation, purchasing and preparation for
this exam.


## Motivation

Though PE180 is a preliminary exam, according to Red Hat site:

```text
By passing this exam, you become a Red Hat Certified Specialist in Containers
for Kubernetes, which also counts toward becoming a Red Hat Certified Architect
(RHCA®)
```

Furthermore, in October 2020, this exam will be transferred to regular one and
each owner of PE180 will become certified in EX180. Looks like a good deal,
especially considering low price on preliminary exam and that I have to
prolongue my RHCA which will end in Jan 01,2021.

However, after passing this exam my RHCA weren't leveled up and weren't
prolongued. I've created a ticket for that - hopefully those issues will be
sorted out.

## Purchasing the exam

Purchasing PE180 was pretty confusing. I couldn't add exam to my cart, no
matter what I tried. Only after contacting support it turned out that I can't
buy directly from Russia. So I had to contact authorized reseller. Not only
exam price was higher(+80USD), but all discounts were unavailable(and they're
up to 50% if you're RHCSA).

## Preparing the hardware for remote exams

Another confising thing was preparing the hardware for remote exams. With
RedHat started delivering regular exams remote in August, it looks like that
even their own support is confused about requirements:
- Authorized reseller told me that external camera is required
- On learn.redhat.com I was told that `These instructions/requirements only
  apply to the Remote Certification exams. The Preliminary Exams(PE) do not
  require an external camera and run on a full-screen browser on your existing
  OS.`
- Support via email told me that I had to flash OS and buy external camera, but
  I can use wired mouse, wired keyboard and external monitor(looks like they
  misread my questions and send me requirements for regular exam)
- Finally, when I've purchased an exam and was passing hardware compatibility
with my laptop closed + external monitor connected, I was constantly receiving
errors `wrong number of cameras` + (!) unable connect to media servers.

After chatting with support I was finally able to clarify requirements:

For laptop:
- No external camera is allowed
- No external monitor is allowed
- No external keyboard is allowed
- External wired mouse is allowed

For PC:
- One monitor is allowed
- External camera is required
- Wired keyboard is required
- Wired mouse is required

In both cases you don't need to flash OS for preliminary exam. All you have to
do is to run Chrome v72+ is full screen mode. Also built-in laptop camera or
external camera should provide enough quality for proctor to read your
government license.

## Preparing for the exam

Since PE180 is a preliminary exam, preparing for it is pretty simple:
- Make sure that you know how to use `podman` and all of it's keys and arguments
- Make sure that you know how to write `Dockerfiles`, build docker images and
  tag images.

Good description of PE180 topics can be found here:
[redhat-PE180-exam-tips](https://github.com/Max-Jaeger/redhat-PE180-exam-tips)

## Exam experience

Network connectivity was fine for me and I was able to pass all checks pretty
quickly. Most annoying thing for me was that my laptop is 13'3 inches running
1920x1080 resolution. I find it hard to read such small letters. And, as usual,
not working keymapping - make sure that you don't press `ctrl+w` or `alt-tab`

Exam is only 1 hour long and I've used all available time.

My result was `274` which means `PASS`.
![pe180](/assets/images/pe180.png)
