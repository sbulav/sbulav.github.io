---
title: "Github actions cancelled terraform jobs"
date: 2020-10-21
categories:
  - #terraform
tags:
  - #terraform
  - #github actions
comments: true
---

Today I've faced small but nasty bug in my Terraform solution. You can read
about solution in [Terraform vs Github Actions](https://sbulav.github.io/terraform/terraform-vs-github-actions/)
and [Github actions matrix secrets](https://sbulav.github.io/terraform/github-actions-matrix-secrets/) articles.

After one unsuccessful run, Terraform state became locked. Pipeline had
following message:

```

This plan was saved to: planfile

To perform exactly these actions, run the following command to apply:
    terraform apply "planfile"

Error: The operation was canceled.
```

As it turned out, Github actions uses `fail-fast` [strategy](https://docs.github.com/en/free-pro-team@latest/actions/reference/workflow-syntax-for-github-actions#jobsjob_idstrategyfail-fast)
by default for matrix jobs.

With that strategy, when one job will be failed, all other jobs will be
cancelled. Applied to Terraform, it results in permamently `locked` state.

To fix this, we need disable `fail-first`. With that, my matrix strategy looks
following:

```
jobs:
  validate-job:
    strategy:
      fail-fast: false
      matrix:
        include:
          - environment: tst
            client_id: TST_TF_ARM_CLIENT_ID
            client_secret: TST_TF_ARM_CLIENT_SECRET
            subscription_id: TST_TF_ARM_SUBSCRIPTION_ID
          - environment: acc
            client_id: ACC_TF_ARM_CLIENT_ID
            client_secret: ACC_TF_ARM_CLIENT_SECRET
            subscription_id: ACC_TF_ARM_SUBSCRIPTION_ID
          - environment: prd
            client_id: PRD_TF_ARM_CLIENT_ID
            client_secret: PRD_TF_ARM_CLIENT_SECRET
            subscription_id: PRD_TF_ARM_SUBSCRIPTION_ID`
```
