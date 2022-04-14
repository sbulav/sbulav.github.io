---
title: "CKS preparation - setting up gVisor"
date: 2020-12-17T06:00:00-04:00
categories:
  - certifications
tags:
  - kubernetes
  - certifications
  - cks
comments: true
toc: true
toc_label: "Setting up gVisor"
---

One of the topics for the Certifies Kubernetes Security Exam(CKS) is usage of
gVisor as container runtime. While in theory configuring gVisor shouldn't be
hard, I've found it difficult to get up and running. gVisor
[documentation](https://gvisor.dev/docs/user_guide/containerd/quick_start/)
alone is definitely not enough to configure gVisor as runtime. In this post, I
will share how kubeadm bootstrapped cluster can be configured to use gVisor.


# Setting up gVisor

I've tested steps below on Kubernetes cluster version 1.19 bootstrapped via
kubeadm with Ubuntu 18.04 as master and worker nodes.

## Setting up prerequisites

Prerequisites for installing containerd are described in
[container-runtimes](https://kubernetes.io/docs/setup/production-environment/container-runtimes/#containerd)
article.

```bash
# NET PREREQUISITES
cat <<EOF | sudo tee /etc/modules-load.d/containerd.conf
overlay
br_netfilter
EOF

sudo modprobe overlay
sudo modprobe br_netfilter

# Setup required sysctl params, these persist across reboots.
cat <<EOF | sudo tee /etc/sysctl.d/99-kubernetes-cri.conf
net.bridge.bridge-nf-call-iptables  = 1
net.ipv4.ip_forward                 = 1
net.bridge.bridge-nf-call-ip6tables = 1
EOF

# Apply sysctl params without reboot
sudo sysctl --system

sudo apt-get update && \
sudo apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg-agent \
    software-properties-common
```

## Setting up containerd

Next step is to install containerd.

```bash
## Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key --keyring /etc/apt/trusted.gpg.d/docker.gpg add -

## Add Docker apt repository.
sudo add-apt-repository \
    "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
    $(lsb_release -cs) \
    stable"

## Install containerd
sudo apt-get update && sudo apt-get install -y containerd.io
```

## Setting up gVisor runtime

To install gVisor runtime from official repository:

```bash
curl -fsSL https://gvisor.dev/archive.key | sudo apt-key add -
sudo add-apt-repository "deb https://storage.googleapis.com/gvisor/releases release main"
sudo apt-get update && sudo apt-get install -y runsc
```

## Configuring containerd to use runsc

In order to use runsc as containerd runtime, apply configuration below to
containerd:

```bash
cat <<EOF | sudo tee /etc/containerd/config.toml
disabled_plugins = ["restart"]
[plugins.linux]
  shim_debug = true
[plugins.cri.containerd.runtimes.runsc]
  runtime_type = "io.containerd.runsc.v1"
EOF
```

and restart containerd:

```bash
sudo systemctl restart containerd
```

## Installing crictl

To interact with containerd in cli, install crictl:

```bash
wget https://github.com/kubernetes-sigs/cri-tools/releases/download/v1.13.0/crictl-v1.13.0-linux-amd64.tar.gz
tar xf crictl-v1.13.0-linux-amd64.tar.gz
sudo mv crictl /usr/local/bin
```

Crictl must be configured to use proper socket to view and manage containers:

```bash
cat <<EOF | sudo tee /etc/crictl.yaml
runtime-endpoint: unix:///run/containerd/containerd.sock
EOF
```

## Configuring kubelet to use containerd as runtime

All that's left is to to configure `kubelet` to use proper runtime and
endpoint:

```bash
cat <<EOF | sudo tee /var/lib/kubelet/kubeadm-flags.env
KUBELET_KUBEADM_ARGS="--network-plugin=cni --pod-infra-container-image=k8s.gcr.io/pause:3.2 --container-runtime=remote --container-runtime-endpoint=/var/run/containerd/containerd.sock --resolv-conf=/run/systemd/resolve/resolv.conf"
EOF
```

Restart `kubelet` to apply new arguments:

```bash
sudo systemctl restart kubelet
```

Now you should have both containerd and kubelet daemons up and running. You can
check it by running:

```bash
sudo systemctl status containerd
sudo systemctl status kubelet
```

Also kubelet should have started system Kubernetes pods. To check this, run:

```bash
sudo crictl pods
```

# Running container in gVisor

For me, running nginx sandbox container mentioned in gVisor's containerd
[quick_start](https://gvisor.dev/docs/user_guide/containerd/quick_start/) didn't
work. I don't know if this is a bug in documentation or in my configuration,
but:
```bash
CONTAINER_ID=$(sudo crictl create ${SANDBOX_ID} container.json sandbox.json)
```
couldn't find sandbox.

But as it turns out, this don't stop kubernetes to run containers with proper
runtime. As in documentation, we will create RuntimeClass:

```YAML
apiVersion: node.k8s.io/v1beta1
kind: RuntimeClass
metadata:
  name: gvisor
handler: runsc
EOF
```

And run pod with gVisor RuntimeClass:

```YAML
apiVersion: v1
kind: Pod
metadata:
  name: nginx-gvisor
spec:
  runtimeClassName: gvisor
  containers:
  - name: nginx
    image: nginx
```

Now we can see that `nginx-gvisor` pod is using gVisor kernel:

```bash
Vagrant@master:~$ kk exec -it  nginx-gvisor -- bash
root@nginx-gvisor:/# uname -a
Linux nginx-gvisor 4.4.0 #1 SMP Sun Jan 10 15:06:54 PST 2016 x86_64 GNU/Linux
```

And on the worker node we can see `runsc-gofer` and `runsc-sandbox` processes:

```bash
root     31585     1  0 08:53 ?        00:00:00 /usr/bin/containerd-shim-runsc-v1 -namespace k8s.io -address /run/containerd/containerd.sock -publish-binary /usr/bin/containerd
root     31611 31585  0 08:53 ?        00:00:00 runsc-gofer --root=/run/containerd/runsc/k8s.io --log=/run/containerd/io.containerd.runtime.v2.task/k8s.io/40be32e837bb5c85074f4baabf7b156a7d9714bc7feedd5a00bc06cd935ab64e/log.json --log-format=json --log-fd=3 gofer --bundle /run/containerd/io.containerd.runtime.v2.task/k8s.io/40be32e837bb5c85074f4baabf7b156a7d9714bc7feedd5a00bc06cd935ab64e --spec-fd=4 --mounts-fd=5 --io-fds=6 --io-fds=7 --apply-caps=false --setup-root=false
nobody   31616 31585  0 08:53 ?        00:00:01 runsc-sandbox --root=/run/containerd/runsc/k8s.io --log=/run/containerd/io.containerd.runtime.v2.task/k8s.io/40be32e837bb5c85074f4baabf7b156a7d9714bc7feedd5a00bc06cd935ab64e/log.json --log-format=json --log-fd=3 boot --bundle=/run/containerd/io.containerd.runtime.v2.task/k8s.io/40be32e837bb5c85074f4baabf7b156a7d9714bc7feedd5a00bc06cd935ab64e --controller-fd=4 --mounts-fd=5 --spec-fd=6 --start-sync-fd=7 --io-fds=8 --io-fds=9 --stdio-fds=10 --stdio-fds=11 --stdio-fds=12 --cpu-num 2 --user-log-fd 13 40be32e837bb5c85074f4baabf7b156a7d9714bc7feedd5a00bc06cd935ab64e
```

Overall application start process in gVisord can be seen as:
1. runsc runtime is started. It implements multiple commands that perform
   various functions such as starting, stopping, listing, and querying the
   status of containers.
2. runsc spawns Sentry and Gofer(runsc-sandbox and runsc-gofer respectively)
3. runsc starts application as it's child subprocess.
  * application running via gVisor is not seen on host
  * runsc spawns multiple childs
4. application calls intercepted by Sentry.
5. Intercepted calls handled via Sentry's own system calls kernel. If system
   call is not implement, it will not be executed.
6. Sentry is making it's own system calls to host OS.
7. Sentry pass system calls to filesystem to Gofer.
