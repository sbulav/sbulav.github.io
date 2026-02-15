---
title: "Using ArgoCD with Azure ACR"
date: 2021-09-15


---

If you want to feel the taste of the GitOps approach one of the best tools
on the market at the moment is ArgoCD. It has all the [features](https://argoproj.github.io/argo-cd/#features)
you'd like to see from such tool and is stable enough to use it in production.

As I'm a huge fan of Helm, the ability to deploy Helm charts is a killer
feature from ArgoCD. Also, we're all in for Azure, so it makes sense to keep
your charts in [Azure ACR](https://docs.microsoft.com/en-us/azure/container-registry/container-registry-helm-repos).

If you'll try to run the command `acr helm`, you'll see a warning message saying
that:

```
acr helm command is implicitly deprecated because command group 'acr helm' is deprecated and will be removed in a future release.
Use 'helm v3' instead
```

You can store your Helm Charts in ACR in new OCI format, and use them in ArgoCD,
but setting it up is not an easy task. In this article, I'll show how this can
be done.

### Prerequisites

I'm assuming that you already have AKS k8s cluster with [attached ACR](https://docs.microsoft.com/en-us/azure/aks/cluster-container-registry-integration?tabs=azure-cli#create-a-new-aks-cluster-with-acr-integration).
For authentication to ACR, I use [Registry tokens](https://docs.microsoft.com/en-us/azure/container-registry/container-registry-repository-scoped-permissions).
They are pretty new, but working fine and they allow me to granually set my
permissions to ACR. Last but not least, installed ArgoCD version 2.x+.

### Publishing Helm Chart to Azure ACR

This process is described pretty well in [Push and pull Helm charts to an Azure container registry](https://docs.microsoft.com/en-us/azure/container-registry/container-registry-helm-repos).
An important thing to mention is that enabling OCI support in Helm3 is done
through setting environment variable:

```bash
export HELM_EXPERIMENTAL_OCI=1
```

Just a short brief of all steps to authenticate and publish Helm 3 chart to ACR:

```bash
# Enable OCI support for Helm 3
export HELM_EXPERIMENTAL_OCI=1
# Login to ACR
echo ${ env.AZUREACR_PUSH_TOKEN } | helm registry login ${ env.ACR_NAME } --username ${ env.AZUREACR_PUSH_USERNAME } --password-stdin
# Update Chart dependencies
helm dependency update ${CHART_DIR}
# Save chart to Local cache
helm chart save ${CHART_DIR} ${ env.ACR_NAME }/${CHART_DIR}:${CHART_VERSION}
# Push it to ACR registry
helm chart push ${ env.ACR_NAME }/${CHART_DIR}:${CHART_VERSION}
```

Once the Chart is pushed to the ACR, you should see it both in the Portal and in
the CLI:

```bash
az acr repository show --name ${ env.ACR_NAME } --repository stable/test

{
  "changeableAttributes": {
    "deleteEnabled": true,
    "listEnabled": true,
    "readEnabled": true,
    "teleportEnabled": false,
    "writeEnabled": true
  },
  "createdTime": "2021-08-25T07:13:11.6953934Z",
  "imageName": "stable/test",
  "lastUpdateTime": "2021-09-15T08:27:57.0738745Z",
  "manifestCount": 14,
  "registry": "myregistry.azurecr.io",
  "tagCount": 6
}
```

### Using OCI chart from Azure ACR in ArgoCD

This is the tricky part, which in many ways feels like not stable enough.
Thes first step is to add OCI repository to the ArgoCD. At the time of writing,
this can only be done through the CLI:

```bash
argocd repo add myregistry.azurecr.io \
  --type helm \
  --name stable \
  --enable-oci \
  --username ${ env.AZUREACR_PUSH_USERNAME } \
  --password ${ env.AZUREACR_PUSH_TOKEN }
```

The next step is to create an application using this registry:

```
argocd app create testapp \
  --repo myregistry.azurecr.io \
  --helm-chart stable/test --revision 1.0 \
  --dest-namespace default \
  --dest-server https://kubernetes.default.svc  \
  --sync-policy auto \
  --values-literal-file values.yaml
```

The command above will deploy chart `stable/test` with revision `1.0` to the
same cluster where ArgoCD is running using `https://kubernetes.default.svc`
with literal values from file `values.yaml`.

Unfortunately, if anything goes wrong, ArgoCD error messages provide little to
no help, so I'll name a few of the bugs which I had to overcome to make this
solution work:
- You can't use tag `latest` with the Helm chart.
- If any of the required values aren't defined, i.e. empty or equals `Null`,
  ArgoCD application will be rendered successfully, but without any resources.
- Repo URL must not include any prefixes like `https://` or `acr://`, just name
  of the registry `myregistry.azurecr.io`

There might be more bugs, but at least it works(when I start my investigations
I wasn't sure that this integration would work at all).

One of the things which I'm yet to figure out is using [Helm chart + values files from Git](https://github.com/argoproj/argo-cd/issues/2789).
The issue is opened for a while, and yet there is no elegant solution - just
workarounds.