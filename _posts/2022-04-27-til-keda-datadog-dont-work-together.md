---
title: "TIL - Keda and DataDog don't work together"
date: 2022-04-27
categories:
  - TIL
  - AWS
tags:
  - aws
comments: true
---

Today I learned that Keda and DataDog don't work together. I was
trying to implement automatic scaling based on the AWS SQS Queue.

While according to the [Scaler Documentation](https://keda.sh/docs/2.6/scalers/aws-sqs/),
everything should work, I kept receiving weird error messages.

After some in-depth investigation, I’ve figured out that issue was not related
to the IAM permissions. As it turns out:
* KEDA is using metrics server v1beta1.external.metrics.k8s.io
* DATADOG is using the same apiservice
* You can only have 1 metric server in a cluster
* The limitation is at the k8s level, there is no workaround

With the new EKS cluster w/o DataDog installed, everything worked like a charm.

Corresponding issues:
- https://github.com/kedacore/keda/issues/470
- https://github.com/kedacore/keda/issues/1827
