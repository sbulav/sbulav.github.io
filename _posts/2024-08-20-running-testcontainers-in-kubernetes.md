---
title: "Running testcontainers in Kubernetes with KubeDock"
date: 2024-08-20
categories:
  - kubernetes
tags:
  - kubernetes
  - containers
comments: true
---

Testcontainers is great framework for replacing complicated mocks in tests with
the real dependencies like databases, message queues, etc.. in containers.

Developers love this framework, and it's really easy to get it running on the
local machine.

However, running testcontainers in Kubernetes, as part of your CI pipeline is
not that obvious.

In this blog post, I will show you how you can achieve this by using
[Kubedock](https://github.com/joyrex2001/kubedock) and what you should
configure Gitlab CI pipeline in order for it to be able to connect to Kubedock
and run containers.

## Problem with running Testcontainers in Kubernetes.

By default, Testcontainers will will attempt to detect the Docker environment
and configure everything to work automatically. It checks for Docker socket in
`unix:///var/run/docker.sock` and uses it to spin up new containers.

If you're running a modern version of Kubernetes, most likely your
[runtime](https://kubernetes.io/docs/setup/production-environment/container-runtimes/)
is not Docker and you don't have Docker socket available.

## Kubedock

One possible solution to run Testcontainers in Kubernetes s to use
[Kubedock](https://github.com/joyrex2001/kubedock). It is a project that
implements docker api that will orchestrate containers on a Kubernetes cluster,
rather than running containers locally. The main driver for this project is to
run tests that require docker-containers inside a container, without the
requirement of running docker-in-docker within resource heavy containers.

There are two ways to run Kubedock:
- As a sidecar, sharing Docker socket as Volume
- As a standalone service, orchestrating test containers.

Kubedock's documentation doesn't have good examples(or any examples) of how you
can run Kubedock as a standalone service, however in my opinion this is the
most comfortable way to integrate Testcontainers in your CI. Also I couldn't
find any article discribing this setup, so I decided to describe my way of
doing it in this blog post.

Let's dive in and see how you can implement this.

### Installing Kubedock in Kubernetes

I'll use namespace gitlab-runner as I want Gitlab CI to communicate with
Kubedock.

First we need to create serviceaccount which Kubedock will use to create
containers:

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: kubedock
  namespace: gitlab-runner
```

Then we need to create role:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: kubedock-role
  namespace: gitlab-runner
rules:
  - apiGroups: [""]
    resources: ["pods"]
    verbs: ["create", "get", "list", "delete", "watch"]
  - apiGroups: [""]
    resources: ["pods/log"]
    verbs: ["list", "get"]
  - apiGroups: [""]
    resources: ["pods/exec"]
    verbs: ["create"]
  - apiGroups: [""]
    resources: ["services"]
    verbs: ["create", "get", "list", "delete"]
  - apiGroups: [""]
    resources: ["configmaps"]
    verbs: ["create", "get", "list", "delete"]
```

And rolebinding:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: kubedock-rolebinding
  namespace: gitlab-runner
subjects:
  - kind: User
    name: system:serviceaccount:gitlab-runner:kubedock
    apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: Role
  name: kubedock-role
  apiGroup: rbac.authorization.k8s.io
```

Next step is to create deployment:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: kubedock-server
  namespace: gitlab-runner
spec:
  replicas: 1
  selector:
    matchLabels:
      app: kubedock-server
  template:
    metadata:
      labels:
        app: kubedock-server
    spec:
      serviceAccountName: kubedock
      containers:
        - name: kubedock-server
          image: joyrex2001/kubedock:0.17.0
          resources:
            limits:
              memory: "4Gi"
              cpu: "1000m"
            requests:
              memory: "2Gi"
              cpu: "200m"
          ports:
            - containerPort: 2475
          args: [
              # Configuration options decribed here:
              # https://github.com/joyrex2001/kubedock/blob/master/config.md
              "server",
              "--namespace=gitlab-runner",
              "--service-account=kubedock",
              "--timeout=20m0s",
              "--request-cpu=1",
              "--request-memory=2Gi",
              "--disable-dind",
              "--reverse-proxy",
              "--reapmax=60m",
              # "-v=3", # Uncomment for debugging
            ]
```

In this Deployment, I cmonfiguring Kubedock to listen for incoming connections
on port 2475. I also disable dind(docker in docker) and expose ports of created
test containers via the built-in reverse-proxy.

Test duration is limited with 20 minutes, and after 60 minutes completed or
failed test containers will be removed.


Final missing piece is headless Kubernetes service:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: kubedock-service
  namespace: gitlab-runner
spec:
  selector:
    app: kubedock-server
  type: ClusterIP
  clusterIP: None
```

I am using headless service(ClusterIP: None) as Kubedock use dynamic port for
each created test containers.


After applying all those manifests, you should see following Logs from the
Kubedock:

```txt
I0820 07:41:20.981507       1 main.go:29] kubedock 0.17.0 (20240802-193331) / kubedock.id=7e1bb6b9fa3d
I0820 07:41:20.982310       1 main.go:109] kubernetes config: namespace=gitlab-runner, ready timeout=20m0s
I0820 07:41:20.982339       1 main.go:111] docker-in-docker support disabled
I0820 07:41:20.983065       1 main.go:165] reaper started with max container age 1h0m0s
I0820 07:41:20.983187       1 main.go:101] enabled reverse-proxy services via 0.0.0.0 on the kubedock host
I0820 07:41:20.983207       1 main.go:115] default cpu request: 1
I0820 07:41:20.983219       1 main.go:119] default memory request: 2Gi
I0820 07:41:20.983251       1 main.go:128] default image pull policy: ifnotpresent
I0820 07:41:20.983265       1 main.go:131] service account used in deployments: kubedock
I0820 07:41:20.983285       1 main.go:134] pod name prefix: kubedock
I0820 07:41:20.983313       1 main.go:138] using namespace: gitlab-runner
```

Now, let's set up connection from the Gitlab runner to our Kubedock service.

## Configuring Gitlab CI pipeline

I will use a simple pipeline, which will run Maven test

```yaml
kubedock_test_job:
  stage: test
  tags:
    - self-hosted-no-dnd
  image: registry.example.com/openjdk17-building:latest
  script:
    - export DOCKER_HOST=tcp://kubedock-service:2475
    - export TESTCONTAINERS_HUB_IMAGE_NAME_PREFIX=registry.example.com/java/
    - export TESTCONTAINERS_RYUK_DISABLED=true
    - export TESTCONTAINERS_CHECKS_DISABLE=true
    - mvn-hh clean test

stages:
  - test
```

In this pipeline I am using a custom pre-build openjdk17-building image from my
private registry.

To do this, I'm configuring testcontainers with following environment
variables:

- DOCKER_HOST - we emulate remote Docker socket by forwarding requests to
headless kubedock-service.
- TESTCONTAINERS_HUB_IMAGE_NAME_PREFIX - all container images should be taken
from our private registry
- TESTCONTAINERS_RYUK_DISABLED - ryuk is a cleanup container and we don't need
to spin it in Kubernetes - Kubedock will do the cleanup.
- TESTCONTAINERS_CHECKS_DISABLE - testcontainers will check if local Docker
socket is available, so this check has to be disabled.

Hopefully, if everything is configured correctly, your Gitlab runner will:

- run tests which will contact Kubedock service
- Kubedock will spin up new kubedock containers, for example database
- Kubedock will proxy requests from tests into the database
- After successful tests, test containers(database) will be removed.
