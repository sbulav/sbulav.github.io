---
title: "CKAD theory pt.1 - Core Concepts"
date: 2020-04-16


---

I thought that I could publish my CKA/CKAD preparation notes, maybe it will be useful for someone.
Mostly it's a compilation of already existing articles, but somewhere I've added my own notes.
So enjoy pt 1 - core components!.

# Core Components

## Master Components

- kube-apiserver - exposes Kubernetes API on the master node
- etcd - HA key-value store, used to store all Kubernetes data
- kube-scheduler - schedules pods to nodes
- kube-controller-manager - runs controllers on master
    - node controller - noticing and responding when node go down
    - replication controller - keeping corrent number of pods for every replica
    - endpoint controller - updates services with correct pod IP addresses
    - service account & token controllers - create default account and API for new namespaces
- cloud-controller-manager - interact with underlying cloud providers(AWS, Azure, ...) K8s 1.6+

## Node components

- kubelet - agent on each node in the cluster, makes sure that containers are running
- kube-proxy - network proxy that runs on each node in the cluster, maintains network rules on nodes
- container-runtime - underlying software that runs containers(Docker, cri-o, containerd)

# Kubernetes objects

Object in Kubernetes is a persistent entity which represent state of API primitives(objects).
Every object must be described using following API conventions:

- Required fields
    - apiVersion - which version of k8s API to use to create this object
    - kind - what kind of object you'd like to create
    - metadata -data that helps uniquely identify the object, including
        - namespace - if not defined, used `default` namespace
        - name - string that uniquely identifies that object in current namespace
        - uid - unique value, generated identifier used to distinguish between objects
        - optional or generated
            - resourceVersion, generation, creationStamp, deletionStamp
            - labels - map of string key:value that used to organize and categorize objects
            - annotations - map of string key:value that can be used by external tools
- Spec - description of desired state of an object
- Status - description of an actual state of an object, updated by k8s


## Pods

Pod is a container or a set of containers in the same namespace. All containers inside a single Pod share storate/network,
and spec how to run the containers.Each Pod is assigned with a unique IP address.
Containers inside a Pod can communicate with one another using `localhost`. Usually Pods are not used by themselves
and manager by Controllers. In this case Controllers manager scheduling, replication, rollout, self-healing and other
capabilities.

## Namespaces

Namespaces is a logically separated space which keeps containers, services, network, storage and permissions separated.
Namespaces can be thought of as Virtual Clusters. Each namespace  can be assigned with a set of resources.
Object names need to be unique for each object in the same namespace.

Default namespace can be changed by:

```bash
kubectl config set-context --current --namespace=xxx
```

## Notes

- ContainerPort defines which port to expose on the pod's IP address(Basically to which port create NAT rules)

# Links

[Kubernetes API conventions](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api-conventions.md#metadata)