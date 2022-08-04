---
title: "CKAD theory pt.6 - Service Networking"
date: 2020-04-27
categories:
  - certifications
tags:
  - kubernetes
  - certifications
  - ckad
comments: true
toc: true
toc_label: "Service Networking"
---

This is part 6 of my personal notes I've written during preparation to CKAD.

# Configuration

* [Understand Services](#services)
* [Demonstrate basic understanding of NetworkPolicies](#networkpolicies)

## Services

Services provides an abstraction layer which provides network access to a dynamic
set of pods.

Most services use `selector` to determine which pods will receive traffice through
the service. All pods included in the service(also called Endpoints) are added and
removed to/from service dynamically without interruption for clients.
You can expose  pod (po), service (svc), replicationcontroller (rc), deployment (deploy)
or a replicaset (rs) as a Service.

### Service types

There are four service types in Kubernetes:
- `ClusterIP` - The services is exposed within the cluster using an internal IP
  address. The service is also accessible using the cluster DNS.
- `NodePort` - The service is exposed externally via a port which listens on each
  node in the cluster.
- `LoadBalancer` - The service is exposed through a load balancer outside of the
  cluster
- `ExternalName` - This maps the service to an external address. It is used to allow
  resources within the cluster to access things outside the cluster through a service.
  This only sets up a DNS mapping. It does not proxy traffic.

### Exposing Kuberenetes resource as a Service via YAML

For example, to redirect traffic incoming to Service on port 80 to any pods with
label `app=MyApp` to port 9376 define following YAML:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app: MyApp
  ports:
    - protocol: TCP
      port: 80
      targetPort: 9376
```

### Exposing Kubernetes resource as a Service via CLI

Services can be exposed via `kubectl expose` command. It will create a new Service object.

```bash
kubectl expose deployment nginx-deployment --port=443 --target-port=8443 --name=nginx-https --dry-run -o yaml
```

Or even shortened:
```bash
kubectl expose deployment nginx-deployment
```
The latter command will use the same name as deployment name, will use containerPort directive to determine
port and targerPort.



## NetworkPolicies

By default, pods are non-isolated. They accept traffic from any source, even from different namespaces.
NetworkPolicies allow you restric traffic to only the traffic flows you actually want to allow.
Once you've applied a NetworkPolicy to a POD, all traffic is denied, and only allowed traffic will flow.

- If there are not policies, all traffic is allowe
- If there is only a ingress policy, traffic FROM the sources mentioned in the ingress policy is allowed
- If there is only a egress policy, traffic TO the sources mentioned in the egress policy is allowed
- If there is a combination of ingress and egress policies, only traffic allowed by both will flow.

NetworkPolicy by itself is a separate Kubernetes object. Main NetworkPolicy fields:
- `podSelector` - determines which pods the NetworkPolicy applies to
- `policyTypes` - set ingress, egress or both
- `ingress` - rules for incoming traffic
- `egress` - rules for outgoing traffic
- `rules` - whitelist(all not mentioned is blocked) rules
  - `ports` - specifies the protocols and ports that match the rule
  - `from/to` - selector that specifies the source(s) and destination(s) of network traffic that match the rule

Ingress and egress supports four kind of selectors to determine what to add to whitelist:
- `podSelector` - matches traffic from/to pods which match the selector
- `namespaceSelector`- matches traffic from/to pods which match the selector.
- `namespaceSelector` and `podSelector`- If both podSelector and namespaceSelector are present,
  pods must match both for traffic to be allowed
- `ipBlock` - CIDR range of IPs

Here's an example of NetworkPolicy in YAML:
```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: test-network-policy
  namespace: default
spec:
  podSelector:
    matchLabels:
      role: db
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - ipBlock:
        cidr: 172.17.0.0/16
        except:
        - 172.17.1.0/24
    - namespaceSelector:
        matchLabels:
          project: myproject
    - podSelector:
        matchLabels:
          role: frontend
    ports:
    - protocol: TCP
      port: 6379
  egress:
  - to:
    - ipBlock:
        cidr: 10.0.0.0/24
    ports:
    - protocol: TCP
      port: 5978
```

This rule isolated pods with `role=db` in the `default` namespace for both ingress and egress. Ingress allows
connections to all pods in the `default` namespace with the label `role=db` on TCP port 6379 from the matching
pods to the rules. Egress allows connection from any pod in the `default` namespace with the label `role=db`
to CIDR on TCP port 5978.

You can get information on current NetworkPolicies in the cluster by:
```bash
kubectl get networkpolicies
kubectl describe networkpolicy my-network-policy
```

### NetworkPolicies on AKS

To AKS cluster support NetworkPolicies, they must be enabled on creation. They aren't enabled by default.
To enable them, create your cluster with `--networkpolicy calico` on your `az aks create`. It cannot
be applied after a cluster has already been created.

# Links

- https://kubernetes.io/docs/concepts/services-networking/service/
- https://kubernetes.io/docs/tutorials/kubernetes-basics/expose/expose-intro/
- https://blog.nillsf.com/index.php/2019/08/18/ckad-series-part-7-services-and-networking/
- https://kubernetes.io/docs/concepts/services-networking/network-policies/
