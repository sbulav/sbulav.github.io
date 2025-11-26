---
title: "Running Rootless Forgejo Runners in Kubernetes on Ubuntu 24.04"
date: 2025-11-26
categories:
  - kubernetes
tags:
  - kubernetes
  - forgejo
  - docker
comments: true
---

Forgejo is a self-hosted Git service that provides a powerful CI/CD system
through Forgejo Actions. However, running Forgejo runners in Kubernetes,
especially in rootless mode, presents several challenges that require careful
configuration.

In this post, I'll walk you through setting up rootless Forgejo runners in
Kubernetes using Docker-in-Docker (DIND) with TLS, and address a specific
issue encountered on Ubuntu 24.04.

## The Challenge

Forgejo runners are not particularly well-suited for running in Kubernetes out
of the box. The runners typically require Docker to execute jobs, but modern
Kubernetes clusters don't expose Docker sockets. Running them in rootless mode
adds another layer of complexity, as it requires specific kernel capabilities
and namespace configurations.

## Solution: Wrenix Helm Chart

A practical solution is to use the
[wrenix forgejo-runner helm chart](https://codeberg.org/wrenix/-/packages/container/helm-charts%2Fforgejo-runner/).
This chart simplifies deployment and provides necessary configuration options
for running Forgejo runners with DIND support.

### Configuring Docker Socket with TLS

To enable Docker commands like `docker build` and frameworks like
Testcontainers to work inside DIND, we need to pass the Docker socket via TCP
with TLS encryption. This is achieved by mounting TLS certificates into the
DIND container.

Here's the key configuration:

```yaml
runner:
  config:
    create: true
    file:
      runner:
        labels:
        - self-hosted
        - default
        envs:
          DOCKER_HOST: tcp://127.0.0.1:2376
          DOCKER_TLS_VERIFY: 1
          DOCKER_CERT_PATH: /certs/client
      container:
        # Allow job containers in DIND to communicate with each other
        network: "host"
        enable_ipv6: false
        privileged: false
        options: -v /certs/client:/certs/client
        valid_volumes:
          # Passing docker certs to connect TCP socket with TLS
          - /certs/client
          # Passing kubernetes SA for vault authentication
          - '/run/secrets/kubernetes.io/serviceaccount'
```

### Configuration Explained

- **DOCKER_HOST**: Points to the DIND container's TCP socket on port 2376
  (TLS-enabled port)
- **DOCKER_TLS_VERIFY**: Enables TLS verification for Docker client
  connections
- **DOCKER_CERT_PATH**: Location where TLS certificates are mounted
- **network: "host"**: Allows job containers within DIND to communicate with
  each other
- **valid_volumes**: Whitelist of volumes that can be mounted into job
  containers, including TLS certificates and Kubernetes service account tokens
  for Vault authentication

So the job containers, running inside DIND, can connect to docker daemon and
communicate with each other.

## Ubuntu 24.04 Rootless Issue

After deploying the runner, you might encounter the following error on Ubuntu
24.04:

```
dind [rootlesskit:parent] error: failed to start the child: fork/exec /proc/self/exe: operation not permitted
```

### Root Cause

Ubuntu 24.04 introduced a new kernel-level security restriction:

```
kernel.apparmor_restrict_unprivileged_userns = 1
```

This setting blocks unprivileged user namespaces, which are critical for
rootless Docker to function through rootlesskit. The restriction prevents
non-root users from creating new user namespaces, effectively breaking
rootless container runtimes.

### Solution

To resolve this issue, you need to disable the AppArmor restriction on your
Kubernetes nodes:

```bash
sudo sysctl -w kernel.apparmor_restrict_unprivileged_userns=0
```

To make this change persistent across reboots, add it to your sysctl
configuration:

```bash
echo "kernel.apparmor_restrict_unprivileged_userns=0" | sudo tee /etc/sysctl.d/99-rootless-docker.conf
sudo sysctl --system
```

Note that this change needs to be applied to all Kubernetes worker nodes where
Forgejo runners may be scheduled.

## Conclusion

While this setup provides a working solution for running rootless Forgejo
runners in Kubernetes, it involves considerable complexity with DIND socket
forwarding and TLS configuration. The community is actively working on
[native Kubernetes runners](https://codeberg.org/forgejo/discussions/issues/66),
which would allow proper scaling, monitoring, and eliminate the need for
complicated DIND socket forwarding. Until then, the wrenix helm chart combined
with the configurations described above offers a viable path forward.
