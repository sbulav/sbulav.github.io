---
title: "TIL - Terraform refactor resources without recreation"
date: 2022-09-30
categories:
  - TIL
  - terraform
tags:
  - terraform
comments: true
---

Today I learned that since `v1.1`, you can move Terraform resources into modules
without recreation using `moved` block. [Refactoring](https://www.terraform.io/language/modules/develop/refactoring)
doc covers such use cases as renaming resources, enabling `count` or `for_each`
and splitting module into multiple modules.

But this doc don't cover my use case, move one or a bunch of resources in the
module. For example, you have AWS SQS resources:

```hcl
resource "aws_sqs_queue" "queue" {
  name                              = var.queue_name
  content_based_deduplication       = var.content_based_deduplication
  deduplication_scope               = var.deduplication_scope
  delay_seconds                     = var.delay_seconds
  fifo_queue                        = var.fifo_queue
  fifo_throughput_limit             = var.fifo_throughput_limit
  kms_data_key_reuse_period_seconds = var.kms_data_key_reuse_period_seconds
  kms_master_key_id                 = var.kms_master_key_id
  max_message_size                  = var.max_message_size
  message_retention_seconds         = var.message_retention_seconds
  policy                            = var.policy
  receive_wait_time_seconds         = var.receive_wait_time_seconds
  redrive_allow_policy              = var.redrive_allow_policy
  redrive_policy                    = var.redrive_policy
  visibility_timeout_seconds        = var.visibility_timeout_seconds
  tags                              = var.tags
}
```

And you want to refactor it into your module:

```hcl
module "queue" {
  source                            = "./modules/sqs/"
  content_based_deduplication       = var.content_based_deduplication
  delay_seconds                     = var.delay_seconds
  env_name                          = var.env_name
  fifo_queue                        = var.fifo_queue
  kms_data_key_reuse_period_seconds = var.kms_data_key_reuse_period_seconds
  kms_master_key_id                 = var.kms_master_key_id
  max_message_size                  = var.max_message_size
  message_retention_seconds         = var.message_retention_seconds
  name                              = var.queue_name
  policy                            = var.policy
  product                           = var.product
  queue_name                        = var.queue_name
  receive_wait_time_seconds         = var.receive_wait_time_seconds
  redrive_allow_policy              = var.redrive_allow_policy
  redrive_policy                    = var.redrive_policy
  tags                              = var.tags
  visibility_timeout_seconds        = var.visibility_timeout_seconds
}
```

By default, `aws_sqs_queue.queue` will be destroyed and
`module.queue.aws_sqs_queue.queue` will be created. You can override this by
using following `moved` syntax:

```hcl
moved {
  from = aws_sqs_queue.queue
  to   = module.queue.aws_sqs_queue.queue
}
```

But if you'll try to extract module into separate repository, you will get 
following error:

```sh
│ Error: Cross-package move statement
│
│   on main.tf line 41:
│   41: moved {
│
│ This statement declares a move to an object declared in external module package "git::https://github.com/user/modules.git?ref=v0.5.5//modules/sqs".
│ Move statements can be only within a single module package.

```

According to [this ticket](https://discuss.hashicorp.com/t/request-for-feedback-cross-package-move-statements/33127/2)
Terraform would not have allowed moving into module.x above if the source
address of that call had not been a `local path`.

So here's my action list to refactor such resources into modules:

1. Move resources into the local `modules` folder
2. Define usage of module in the main block instead of plain resources
3. Add moved block for every resource, for example: 
```
moved {
  from = aws_sqs_queue.queue
  to   = module.queue.aws_sqs_queue.queue
}
```
4. Run Terraform plan to make sure that resources aren't recreated
5. Apply Terraform plan
6. Clean up moved blocks
