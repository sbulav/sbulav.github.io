---
title: "CKS preparation - RBAC apiGroups"
date: 2021-01-28


---

During my CKS preparations, I've faced with one not obvious thing - selection
apiGroups in RBAC rules.

Resources in Kubernetes are associated with API Groups (for example, Pods
belong to the `core` API group whereas Deployments belong to the `apps` API
group).

As an illustration: this example will not work, as there are no resource
"deployments" in core API group:
```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: reader
rules:
- apiGroups: [""] # "" indicates the core API group
  resources: ["deployments"]
  verbs: ["get", "watch", "list"]
```

This example will work, as Deployments are in "apps" API group:
```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: reader
rules:
- apiGroups: ["apps"]
  resources: ["deployments"]
  verbs: ["get", "watch", "list"]
```

You can available API groups by executing:
```
kubectl api-resources
```

Some important ones(output is truncated for brevity):
```
NAME                                SHORTNAMES      APIGROUP                       NAMESPACED   KIND
configmaps                          cm                                             true         ConfigMap
endpoints                           ep                                             true         Endpoints
namespaces                          ns                                             false        Namespace
nodes                               no                                             false        Node
persistentvolumeclaims              pvc                                            true         PersistentVolumeClaim
persistentvolumes                   pv                                             false        PersistentVolume
pods                                po                                             true         Pod
replicationcontrollers              rc                                             true         ReplicationController
resourcequotas                      quota                                          true         ResourceQuota
secrets                                                                            true         Secret
serviceaccounts                     sa                                             true         ServiceAccount
services                            svc                                            true         Service
controllerrevisions                                 apps                           true         ControllerRevision
daemonsets                          ds              apps                           true         DaemonSet
deployments                         deploy          apps                           true         Deployment
replicasets                         rs              apps                           true         ReplicaSet
statefulsets                        sts             apps                           true         StatefulSet
cronjobs                            cj              batch                          true         CronJob
jobs                                                batch                          true         Job
certificatesigningrequests          csr             certificates.k8s.io            false        CertificateSigningRequest
daemonsets                          ds              extensions                     true         DaemonSet
deployments                         deploy          extensions                     true         Deployment
ingresses                           ing             extensions                     true         Ingress
networkpolicies                     netpol          extensions                     true         NetworkPolicy
podsecuritypolicies                 psp             extensions                     false        PodSecurityPolicy
replicasets                         rs              extensions                     true         ReplicaSet
ingresses                           ing             networking.k8s.io              true         Ingress
networkpolicies                     netpol          networking.k8s.io              true         NetworkPolicy
clusterrolebindings                                 rbac.authorization.k8s.io      false        ClusterRoleBinding
clusterroles                                        rbac.authorization.k8s.io      false        ClusterRole
rolebindings                                        rbac.authorization.k8s.io      true         RoleBinding
roles                                               rbac.authorization.k8s.io      true         Role
...
```

It's considered best practice to explicitly specify apiGroups/resources/verbs,
but in rare cases(Like Velero backup solution) all permissions can be granted:

```yaml
rules:
  - apiGroups:
    - '*'
    resources:
    - '*'
    verbs:
    - '*'
```