---
title: "TIL - Helm respect current replicas"
date: 2021-06-18
categories:
  - til
tags:
  - helm
  - kubernetes
comments: true
---

When you upgrade deployed Helm chart, you probably have `replicas` defined in
values or pass it through `set`.

But sometimes it's useful to respect the current amount of replicas, for
example:
- If you're using Horizontal Pod Autoscaler
- If you're managing replicas through external automatization/script.

During my tests, Helm had the following behavior:
- If `replicas` defined, but has an empty number:
  - Helm2 will preserve the current amount of replicas
  - Helm3 will reset the amount of replicas to 1
- If `replicas` is not defined(not in the rendered template), both Helm2 and
  Helm3 will respect current replicas. The amount of replicas gets reset to 1
  only in one case:
  - `replicaCount` is defined in values and Helm chart is deployed with that
    values
  - `replicaCount` removed from the values and the chart is upgraded with the
    new values
  - actual replicas become 1

See [Issue 7090](https://github.com/helm/helm/issues/7090) for more details.
