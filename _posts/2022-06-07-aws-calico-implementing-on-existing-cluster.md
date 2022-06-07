---
title: "Implementing Calico CNI on existing cluster"
date: 2022-06-07
categories:
  - AWS
tags:
  - aws
  - calico
comments: true
---

In one of our production clusters, we've faced the issue of depleting the IP
addresses, due to how ENI assigns and reserves IP addresses. You can check
out [ENI Max Pods](https://github.com/awslabs/amazon-eks-ami/blob/master/files/eni-max-pods.txt)
for the numbers.

The most obvious choice is to use a different CNI plugin for the EKS, with Calico
being the most popular one.

However, it was not an easy task, as:
* [AWS Calico](https://docs.aws.amazon.com/eks/latest/userguide/calico.html)
  guide only uses Calico as a Network Policy engine. It's also pretty confusing
  with all those Helm deprecation notes. Furthermore, it just doesn't work for
  me from the box.
* [Calico Getting Started on EKS](https://projectcalico.docs.tigera.io/getting-started/kubernetes/managed-public-cloud/eks)
  the guide is much better, but still, it lacks a few important steps and requires
  you to create a new EKS via `eksctl`

Due to this, I've decided to write this post, summarizing my experience with
Calico. I'll show how to deploy Calico as CNI plugin to the existing cluster, with
`VXLANCrossSubnet` for Pods communicating between the nodes.


## Prerequisites

* A running EKS cluster.
* AWS CNI is used.

## Installation

### Remove `aws-node` daemon set to disable AWS VPC.

```sh
kubectl delete daemonset -n kube-system aws-node
```

Please be aware that if your cluster was created through the web interface, you'll
probably have AWS CNI add-on enabled. Due to this, it will recreate `aws-node`
daemonset automatically.

You can disable the AWS CNI plugin through the web interface
or by running:

```sh
aws eks delete-addon --cluster-name eks-cluster --addon-name vpc-cni --preserve
```

### Allow required ports in the node security group.

For unknown to me reason, opening ports is not mentioned in the [Calico EKS](https://projectcalico.docs.tigera.io/getting-started/kubernetes/managed-public-cloud/eks)
guide, but without those ports, Calico components will not work. You can
check all Calico prerequisites on this page: [Calico Prerequisites](https://projectcalico.docs.tigera.io/getting-started/kubernetes/requirements)

For VXLAN, the following ports are required(!Rules have to be added to the node security groups,
not to the cluster SGs):
* UDP 4789 Incoming and Outgoing
* TCP 5473 Incoming(Though documentation says that only incoming ports are required,
  I had to open the outgoing port as well to make `aws-node` work)

<img width="1819" alt="Screenshot 2022-06-07 at 14 39 22" src="https://user-images.githubusercontent.com/28604639/172375150-bd7a7f57-f166-4bea-b026-f78b29ea5a8b.png">


### Install the Operator

```
kubectl create -f https://projectcalico.docs.tigera.io/manifests/tigera-operator.yaml
```

Notice that Calico operator is using image `quay.io/tigera/operator:v1.27.1`,
so you might need to allow traffic to this registry.

### Create Calico installation

Installation CRD will describe to the operator how it should configure Calico, i.e.
should it deploy CNI or just work with network policy, which IP pool to use
and how to configure communication between the Pods.

```yaml
kind: Installation
apiVersion: operator.tigera.io/v1
metadata:
  name: default
spec:
  kubernetesProvider: EKS
  registry: quay.io
  cni:
    type: Calico
  calicoNetwork:
    bgp: Disabled
    ipPools:
      - cidr: 192.168.0.0/16
        encapsulation: VXLANCrossSubnet
```

In this yaml, there are a few parameters that I'd like to clarify:
* `registry: quay.io` - For me, all requests to the Docker registry were rate limited.
  Since Calico maintains a fully functional repository in the `quay.io` registry,
  it makes sense to use it instead of Docker Hub.
* `encapsulation: VXLANCrossSubnet` - for the Pods to be able to communicate with
  each other between the nodes, [Overlay
  network](https://projectcalico.docs.tigera.io/networking/vxlan-ipip) must be
  used. Calico supports VXLAN and IPinIP encapsulation. By setting encapsulation
  to VXLANCrossSubnet, we perform encapsulation selectively, and only for
  traffic crossing subnet(node) boundaries.

### Recreate all nodes in the node group

For `calico-node` to properly configure iptables, each node in the
cluster must be recreated. This can be done in a few ways:
* Remove the old node group and attach a new one
* Scale nodegroup to 0, wait for the termination, scale nodegroup back to
  the desired size.
* Manually terminate each instance in the node group.

### Verify that Calico pods are up and running

```sh
kubectl get pods -n calico-system -o wide
```

<img width="1781" alt="Screenshot 2022-06-07 at 14 43 49" src="https://user-images.githubusercontent.com/28604639/172375218-8cd551db-0041-46a5-b548-b3bffbe6e406.png">

### Verify that Pods on different nodes can communicate with each other

Run a few busybox images which contain `ping`:

```sh
kubectl create deployment pingtest --image=quay.io/prometheus/busybox --replicas=3 -- sleep infinity
```

Pick two Pods running on different nodes and notice their IPs:

```sh
kubectl get pods -o wide
```

<img width="1212" alt="Screenshot 2022-06-07 at 15 09 16" src="https://user-images.githubusercontent.com/28604639/172375439-f4730f71-7419-49b9-8a11-cc1891948a26.png">

SSH into one Pod and ping another:

<img width="943" alt="Screenshot 2022-06-07 at 14 50 27" src="https://user-images.githubusercontent.com/28604639/172375352-ab457a16-f751-45b8-8295-8e499ba65cab.png">

For me, this was sufficient, however, you might need to disable
[Source/Destination IP
check](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_NAT_Instance.html#EIP_Disable_SrcDestCheck)

One of the Calico daemons, Felix, can do this automatically with
[awsSrcDstCheck](https://projectcalico.docs.tigera.io/reference/resources/felixconfig#spec)
set to Disable:

```yaml
apiVersion: crd.projectcalico.org/v1
kind: FelixConfiguration
metadata:
  name: default
spec:
  awsSrcDstCheck: Disable
  bpfLogLevel: ""
  floatingIPs: Disabled
  healthPort: 9099
  logSeverityScreen: Info
  reportingInterval: 0s
```

### Remove limitation of max pods per node

If needed, you can remove the limit of max pods per node by using [EC2 bootstrap](https://github.com/awslabs/amazon-eks-ami/blob/master/files/bootstrap.sh)
script `--use-max-pods` to false.

To do this, modify the node group launch template and provide the
following user data in the launch template:

```sh
/etc/eks/bootstrap.sh my-cluster \
  --use-max-pods false \
  --kubelet-extra-args '--max-pods=110'
```
For more info, check out [CNI Increase IP addresses](https://docs.aws.amazon.com/eks/latest/userguide/cni-increase-ip-addresses.html)


## Conclusion

Calico is a great tool offering network policy, IP address management
capabilities, and much more. Hopefully, this post made the installation of Calico
a bit more clear.
