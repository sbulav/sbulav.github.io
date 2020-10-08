---
title: "Github actions matrix secrets"
date: 2020-10-08
categories:
  - terraform
tags:
  - terraform
  - github actions
comments: true
---

My team is continuing migration to GitHub Actions, and one of the pipelines we
are working on is Terraform validation pipeline. I've described this pipeline in
[Terraform vs Github Actions](https://sbulav.github.io/terraform/terraform-vs-github-actions/)
article.

This pipeline worked great for one environment, but how do you run it to validate
multiple environments?

It's possible to do in Github Actions, but it's not straightforward.

## Matrix Secrets

Matrix strategy runs your jobs in parallel, so all you need to do to run
validation pipeline on multiple environments is to:

```
jobs:
  validate-job:
    strategy:
      matrix:
        environment: [tst, acc, prd]
```

Tricky part is to define environment variables for each environment. Simplest way
to do this in GitHub Actions is to check matrix variable and define specific
stages for tst, acc, prd...

```
- name: Terraform init
  env:
    ARM_CLIENT_ID: \${{ secrets.TST_TF_ARM_CLIENT_ID }}
    ...
  id: init
  run: |
    terraform init -input=false -backend-config=<YOUR CONFIG>
    terraform workspace new \${{ matrix.environment }} || true
    terraform workspace select \${{ matrix.environment }}
  if: matrix.environment  == 'dev'
```

But this way have many downfalls - not DRY code, step id must be unique so it's
harder to catch all output from all stages, etc...

Unfortunately, it's not possible to "double interpolate" variable to substitute
craft secret name. But there's a trick which can be used to achieve the same
result:

```
jobs:
  validate-job:
    strategy:
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
            subscription_id: PRD_TF_ARM_SUBSCRIPTION_ID
    env:
      ARM_TENANT_ID: \${{ secrets.ARM_TENANT_ID }}
      ARM_CLIENT_ID: \${{ secrets[matrix.client_id] }}
      ARM_CLIENT_SECRET: \${{ secrets[matrix.client_secret] }}
      ARM_SUBSCRIPTION_ID: \${{ secrets[matrix.subscription_id] }}
    ...
```

I'm using recently added [Include combinations syntax](https://docs.github.com/en/free-pro-team@latest/actions/reference/workflow-syntax-for-github-actions#example-including-additional-values-into-combinations)
to define unique matrix combinations with secret names as matrix parameters. In
the example above I define 3 unique combinations, so there will be 3 parallel
jobs. Later in global environments I reference secret name via matrix variable,
for example: `\${{ secrets[matrix.client_id] }}`

Using this approach I define environments only once and keep my code clean.
