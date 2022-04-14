---
title: "TIL - Helm chart-testing custom values"
date: 2021-08-02
categories:
  - #TIL
tags:
  - #helm
  - #kubernetes
comments: true
---

Testing your changes to the Helm chart is a must if you want to minimize the
risk of failure. There are a set of techniques, which you may use to validate
your chart:
* Running `helm lint`
* Running `helm template`
* Running `helm upgrade --dry-run` against real installation
* Installing helm chart to Kubernetes cluster.

However, all those techniques aren't very convenient when you need to test
multiple values files, covering different aspects of your Helm chart.

There is a specific tool for that, [chart-testing](https://github.com/helm/chart-testing).
It integrates nicely into pipelines, has all functional which I require, with
one exception - it wasn't clear how to specify custom values for testing.

By default, `ct` will test your chart with the default values file, and this
prevented me from using this tool.

Today I learned that you can specify custom values by creating folder `ci` in
Helm Chart directory and putting a set of values files having `*-values.yaml` as
a suffix. See [Providing Custom values](https://github.com/helm/charts/blob/master/test/README.md#providing-custom-test-values)
for more details.

This way I can create values for testing for example only Ingresses(having 0
replicas in Deployment) or only test monitoring add-ons.

I really not sure why they don't have it in their README.
