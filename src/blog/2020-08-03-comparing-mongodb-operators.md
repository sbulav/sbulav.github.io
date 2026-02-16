---
title: "Comparing Enterprise vs Community MongoDB K8S Operators"
date: 2020-08-03
categories:
  - kubernetes
tags:
  - kubernetes
  - mongodb
  - operators
comments: true
---

Recently I was evaluating MongoDB Kubernetes operators, as one possible way to
migrate On-Prem MongoDB servers. I weren't able to find any comparison, so I
had to did it on my own.

## Enterprise vs Community MongoDB K8s Operators

| Criteria                        | mongodb-kubernetes-operator                                                                                                                     | mongodb-enterprise-kubernetes                                                                                    |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| URL                             | [mongodb-enterprise-kubernetes/](https://github.com/mongodb/mongodb-enterprise-kubernetes/)                          | [mongodb-kubernetes-operator](https://github.com/mongodb/mongodb-kubernetes-operator) |
| License                         | development, testing, and evaluation purposes only                                                                                              | APACHE                                                                                                           |
| Maturity                        | General availability, Guthub 181 stars                                                                                                          | Opensource, Github 64 stars                                                                                      |
| Documentation                   | Github + enterprise-grade documentation: [k8s-operator](https://docs.mongodb.com/kubernetes-operator/stable/tutorial/install-k8s-operator/)                     | Github, pretty sparse                                                                                            |
| Topology                        | Standalone<br>ReplicaSet<br>ShardedCluster                                                                                                      | ReplicaSet                                                                                                       |
| Upgrading                       | Yes                                                                                                                                             | Yes                                                                                                              |
| Downgrading                     | Yes                                                                                                                                             | Yes                                                                                                              |
| Scaling                         | Yes                                                                                                                                             | Yes                                                                                                              |
| TLS:                            | Yes                                                                                                                                             | Yes                                                                                                              |
| Options                         | Many: [replicaset options](https://docs.mongodb.com/kubernetes-operator/stable/tutorial/deploy-replica-set/#change-the-highlighted-settings-to-your-preferred-values) | A few                                                                                                            |
| Requests                        | Yes                                                                                                                                             | No                                                                                                               |
| Limits                          | Yes                                                                                                                                             | No                                                                                                               |
| PVC                             | Yes                                                                                                                                             | Yes                                                                                                              |
| PVC configuration               | Yes                                                                                                                                             | No, default 10G                                                                                                  |
| Integration with<br>Ops Manager | Yes                                                                                                                                             | No                                                                                                               |
| Monitoring                      | Yes, via OpsManager                                                                                                                              | No                                                                                                               |
| Backups                         | Yes, via OpsManager                                                                                                                              | No                                                                                                               |

## Results

`MongoDB Community Kubernetes Operator` is still pretty young and not widely
adopted. It supports only ReplicaSet with basic functional. At the moment it is
not possible to configure Pod Template options and PVC options, like
storageclass or size.

`MongoDB Enterprise Kubernetes Operator` is more mature, but still in general
availability. It provides wide amount of options, allowing finely tune your
database. Also it is integrated with OpsManager, providing nice webUI with
graphs, managements options and built-in backups. On the downside, due to it's
license, it's only allowed for development or testing. To use it it production,
you have to buy it.

At the time of writing(2020-08-03) Community Operator doesn't look mature for
production use. Enterprise Operator looks good, but it requires purchase.

For us the decision was to use [MongoDB Helm Chart](https://bitnami.com/stack/mongodb/helm)
with our own IaaC solution.
