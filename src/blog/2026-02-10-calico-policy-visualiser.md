---
title: "Calico Network Policy Visualiser"
date: 2026-02-10
categories:
  - kubernetes
tags:
  - kubernetes
  - calico
comments: true
---

At work, we use Calico network policies extensively. Between `NetworkPolicy`
and `GlobalNetworkPolicy` resources across multiple clusters, keeping track
of what's allowed and what's blocked gets complicated fast. Reading raw YAML
works when you have one simple policy, but once you're dealing with dozens of
rules across ingress and egress, with selectors, CIDR blocks, and port ranges
mixed together, it's easy to miss something.

Cilium folks have a free [Network Policy Editor](https://editor.networkpolicy.io/)
that lets you create, visualize, and share Kubernetes network policies right in
the browser. It's a well-made tool, and I've seen it recommended many times in
the community. But it only works with standard Kubernetes `NetworkPolicy` and
Cilium-specific policies. If you're on Calico, you're out of luck.

Calico does have visualization features, but they're locked behind
[Calico Cloud](https://www.calicocloud.io/) and
[Calico Enterprise](https://www.tigera.io/tigera-products/calico-enterprise/).
There's nothing free and open for the community. So I built my own.

## Calico Policy Visualiser

The idea is simple: paste or import your Calico YAML, get an interactive graph
and a plain-English explanation of what the policy does. Everything runs
client-side, no data leaves your browser. You can try it out at
[sbulav.github.io/calico-visualiser](https://sbulav.github.io/calico-visualiser/).

<!-- TODO: upload screenshot to GitHub and replace src with user-attachments URL -->
<img width="3750" height="2150" alt="Calico Policy Visualiser screenshot" width="100%" src="https://github.com/user-attachments/assets/bce9bd3a-03f3-4ce3-98fd-d4fc0308508e" />

The interface has three synchronized panels:

- **YAML editor** on the left. It's a full CodeMirror editor with syntax
  highlighting. You can edit the YAML directly and the graph updates live.
  If you break the YAML mid-edit, the last valid visualization stays on
  screen and an error banner shows the parse issue.
- **Graph** in the center. A React Flow canvas with the policy node in the
  middle, connected to rule categories: Outside Cluster (CIDRs), In Namespace
  (pod selectors), In Cluster (cross-namespace). Edges are color-coded: green
  for Allow, red for Deny, amber for Log or mixed actions. Hover a rule card
  to highlight the matching YAML lines in the editor.
- **Explanation** at the bottom. A text breakdown of the policy: effective
  defaults, per-rule descriptions, flag details (`doNotTrack`, `preDNAT`,
  `applyOnForward`). It recognizes 20 well-known ports, so you see
  "Redis (6379)" or "PostgreSQL (5432)" instead of bare numbers.

## Features

- Full Calico v3 spec support: selectors, `namespaceSelector`,
  `serviceAccountSelector`, tier, order, types (inferred if missing), rules
  with all actions (Allow/Deny/Log/Pass), protocol, ICMP, source/destination
  with nets, ports, services, serviceAccounts, negation fields (`notNets`,
  `notPorts`, `notSelector`), HTTP match, `ipVersion`, and policy flags.
- Inferred access indicators: the graph shows whether Kubernetes DNS, any
  pod in the namespace, or everything in the cluster is allowed, denied, or
  uncertain based on the current rules.
- Built-in sample policies to get started quickly.
- Supports both `NetworkPolicy` and `GlobalNetworkPolicy`.
- No backend. No accounts. No data sent anywhere.

## Built with Claude

Yes, the code was written by Claude Opus 4.6. The project has 252 tests
across seven test files, and I'm reasonably happy with the result.

## What's next

I plan to open-source the code under MIT license soon. The repository isn't
public yet, but it will be.

I hope someone will find this project as useful as I do.
