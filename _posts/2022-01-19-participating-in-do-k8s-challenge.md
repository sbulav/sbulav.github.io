---
title: "Participating in Digital Ocean Kubernetes Challenge"
date: 2022-01-19
categories:
  - #kubernetes
tags:
  - #kubernetes
  - #digital-ocean
comments: true
---

When I saw that Digital Ocean @digitalocean is organizing a [Kubernetes Challenge](https://www.digitalocean.com/community/pages/kubernetes-challenge)
I decided that I'll participate.

The idea behind the challenge is pretty cool - you pick one of the proposed
scenarios, DO give you some credit to implement this scenario, you create
a write-up describing your experience.

I've picked `Deploy a solution for policy enforcement`, from the expert projects:

```text
Install and use Kyverno, a policy engine designed for Kubernetes. It can
validate, mutate, and generate configurations using admission controls and
background scans. Kyverno policies are Kubernetes resources and do not require
learning a new language. Kyverno is designed to work well with tools you
already use like kubectl, kustomize, and Git. Create policies for mandatory
labels for every deployment, and image download only permitted from DOCR.

https://kyverno.io/policies/

```

I'm familiar with [Open Policy Agent](https://www.openpolicyagent.org/) and I
decide that it's a great opportunity to learn another security tool.

Here's my [solution](https://github.com/sbulav/do-k8s-challenge), focusing on
automation via GitHub Actions.

Among cool things:
- Pipeline for the initial deployment of Kyverno Helm chart to the DOKS
- Any changes to the Helm values will trigger Helm upgrade.
- Policies in DOKS will be updated automatically if any policy has changed.
- Commits are validated to use [Conventional Commits style](https://www.conventionalcommits.org)
- Helm values are linted and validated
- If Helm values or policies changed, Helm diff is inserted into the PR


A few thought about the challenge:
- Creating a PR with  a markdown describing your challenge was pretty
  frustrating
- PRs were opened for weeks without comment or any action
- It would be interesting to receive some feedback about the solution.
- Another cool thing would be mentioning interesting projects.

All the projects have very different levels, while some have very high level of
implementation. If you have some time, browse through the [DO k8s projects](https://github.com/do-community/kubernetes-challenge),
maybe you will find a hidden gem.

Prizes are pretty cool, besides the swag, you receive a 150$, which you can
donate to Open Source.

I've spent my prize to support my [favorite text editor](https://github.com/neovim/):

<img width="482" alt="Screenshot 2022-01-17 at 10 44 07" src="https://user-images.githubusercontent.com/28604639/150086730-661d16e6-2a86-4d35-aa31-96823a0eb984.png">

