---
title: "TIL - Kubectl integrated Kustomize"
date: 2022-09-09
categories:
  - TIL
  - Kubernetes
tags:
  - kubernetes
comments: true
---

Today I learned that since 1.14, 'kubectl' has Kustomize
integrated in it:

```sh
> kubectl apply --help | grep kustomize -A2
-k, --kustomize='':
    Process a kustomization directory. This flag can't be used together with -f or -R.

> kubectl kustomize --help |head -n8
Build a set of KRM resources using a 'kustomization.yaml' file. The DIR
argument must be a path to a directory containing 'kustomization.yaml', or a
git repository URL with a path suffix specifying same with respect to the
repository root. If DIR is omitted, '.' is assumed.

Examples:
  # Build the current working directory
  kubectl kustomize

  # Build some shared configuration directory
  kubectl kustomize /home/config/production
```

I don't know how I've missed this change, but it's nice to know.

More info:
- [Declarative Management of Kubernetes Objects Using Kustomize](https://kubernetes.io/docs/tasks/manage-kubernetes-objects/kustomization/)
