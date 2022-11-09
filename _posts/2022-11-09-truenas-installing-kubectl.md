---
title: "Truenas Scale configure kubectl k9s"
date: 2022-11-10
categories:
  - truenas
tags:
  - truenas
  - kubectl
  - k9s
comments: true
---

TrueNas Scale uses [k3s](https://k3s.io/), which is a lightweight
Kubernetes distribution. It's intended to be used only as platform for
[APPS](https://www.truenas.com/docs/scale/scaletutorials/apps/usingapps/), but
I don't see why you can't use it as your playground.

## Connecting to TrueNas k3s locally
This way you connect to k3s locally, which is more secure than exposing your
Kubernetes API. Also, if you don't want to install anything, you can use `sudo k3s kubectl`
 as a regular user.
However, this way:
* you have to enter sudo password all the time
* editing in k9s doesn't work as it invokes `kubectl edit` under the hood

I think that more convenient solution is to install kubectl, k9s and
configure user kubeconfig. Here's how you can do this:

1. Make sure that shell knows about `~/bin` path. For fish, it's:
```sh
set -a PATH "$HOME/bin/"
```
This line can be added to `~/.config/fish/config.fish`
2. Download kubectl
```
mkdir ~/bin
cd ~/bin
curl -LO https://storage.googleapis.com/kubernetes-release/release/v1.25.0/bin/linux/amd64/kubectl
chmod +x kubectl
```
3. Configure kubeconfig
```sh
mkdir ~/.kube
sudo cp /etc/rancher/k3s/k3s.yaml ~/.kube/config
sudo chown -R <USER> ~/.kube/config
```
4. Check that kubectl configured properly:
```sh
sab@truenas ~> kubectl version -o yaml
clientVersion:
  buildDate: "2022-10-18T16:38:44Z"
  compiler: gc
  gitCommit: 7d66e419556e1be16c1a6cc3f9178f3bd8a95b54
  gitTreeState: dirty
  gitVersion: v1.24.4+k3s-7d66e419-dirty
  goVersion: go1.19.1
  major: "1"
  minor: "24"
  platform: linux/amd64
kustomizeVersion: v4.5.4
serverVersion:
  buildDate: "2022-10-18T16:38:44Z"
  compiler: gc
  gitCommit: 7d66e419556e1be16c1a6cc3f9178f3bd8a95b54
  gitTreeState: dirty
  gitVersion: v1.24.4+k3s-7d66e419-dirty
  goVersion: go1.19.1
  major: "1"
  minor: "24"
  platform: linux/amd64
```
5. Install k9s
```
curl -LO https://github.com/derailed/k9s/releases/download/v0.26.7/k9s_Linux_x86_64.tar.gz
tar xvf k9s_Linux_x86_64.tar.gz
mv k9s ~/bin/
```
6. Run k9s to check that it's working

## Connecting to TrueNas k3s remotely

Exposing k3s can be risky, please make sure that you understand what you're doing.
As of now, k3s in TrueNas listens on all ports:
```sh
sab@truenas ~> ss -tlen | grep :6443
LISTEN 0      4096                                    *:6443             *:*    ino:22275 sk:2073 cgroup:/system.slice/k3s.service
```
But it's protected by the IPTABLES.

So, to grant access to the Kubernetes API:
1. remove DROP rule from the IPTABLES:
```
iptables -D INPUT -p tcp -m tcp --dport 6443 -m comment --comment "iX Custom Rule to drop connection requests to k8s cluster from external sources" -j DROP
```
By the way, you can [Truetool](https://github.com/truecharts/truetool/) script to do the same.
2. copy kubeconfig from `/etc/rancher/k3s/k3s.yaml`  to your local machine
3. configure `KUBECONFIG` environment variable to point to this file:
```sh
sab@mbp13 ~> export KUBECONFIG=/Users/sab/.kube/truenas
sab@mbp13 ~> kubectl get ns
NAME              STATUS   AGE
default           Active   6d12h
kube-system       Active   6d12h
kube-public       Active   6d12h
kube-node-lease   Active   6d12h
openebs           Active   6d12h
ix-pihole         Active   6d12h
metallb-system    Active   41h
tc-system         Active   41h
ix-grafana        Active   38h
ix-loki           Active   23h
```
