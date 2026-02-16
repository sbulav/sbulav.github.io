---
title: "CKAD theory pt.3 - Multi Container Pods"
date: 2020-04-22T06:00:00-04:00
categories:
  - certifications
tags:
  - kubernetes
  - certifications
  - ckad
comments: true
toc: true
toc_label: "Multi Container Pods"
---
This is part 3 of my personal notes I've written during preparation to CKAD.

# Multi-Container Pods

* [Understand Multi-Container Pods](#multi-container-pods)
* [Patterns](#patterns)

## Multi-Container Pods

Multi-container pods provide an opportunity to enhance containers with helper containers. Multi-container
Pods runs in the same namespaces, so containers can share resources and communicate with each other.

Among the ways that containers can use to interact are:
- Shared Network - all listening ports are accessible to other containers in POD, even if they are not
  exposed outside of the POD
- Shared Storage Volumes - containers can interact with each other by reading and modifying files in a shared storage
  that is mounted to both containers
- Shared Process Namespace - with processes namespace sharing enabled, containers in the same pod can interact with
  and signal one another's processes. Requires to explicitly enable `shareProcessNamespace: true` in the POD spec.


## Patterns

CKAD concentrates on three main multi-container pod patterns:
- Sidecar container - adds functionality to main container in some way. For example, a container that syncs files
  from main container to GIT. By separating this functionality, it's possible to evolve both containers independently.
- Ambassador container - act as a network proxy, by accepting network traffic, possibly modifying it and passing
  to main container.
- Adapter container - takes the output from main container and modifies it, representing in required format. Very useful
  for monitoring.

### Sidecar example

```text
LoadBalancer-> Service with IP of POD -> PORT 443 -> Container with NGINX, rm SSL-> Localhost:80 -> Apache web server
```

### Ambassador example

In this example, ambassador acts as an entrypoint, balancing traffic between 2 web servers PODs

```text
LoadBalancer-> Ambassador POD:80 -> Nginx server1 weight=3 - > Service Server1:80 -> Server1 POD
                                 -> Nginx server2            > Service server2:80 -> Server2 POD
```
### Adapter example

In this example, adapter grabs the data from redis and prepare it for prometheus

```text
Prometheus -> Service Redis Adapter:9121 -> Redis_Exporter Container -> Redis Container
```



# Links

- [blog.nillsf.com](https://blog.nillsf.com/index.php/2019/07/28/ckad-series-part-4-multi-container-pods/)
- [Designing Distributes Systems](https://azure.microsoft.com/en-us/resources/designing-distributed-systems/)
- [Sidecar Example](https://kubernetes.io/docs/concepts/cluster-administration/logging/#using-a-sidecar-container-with-the-logging-agent)

