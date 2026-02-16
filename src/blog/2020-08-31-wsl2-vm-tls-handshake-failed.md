---
title: "WSL2/VM TLS Handhake failed"
date: 2020-08-31
categories:
  - wsl
tags:
  - fish
  - tls
  - wsl
comments: true
---

Recently I was very annoyed by random TLS errors, for example:

```bash
kubectl get pods
error: couldn't read version from server: Get https://master-ip/api: net/http: TLS handshake timeout
```

I was receiving those errors during executing kubectl commands, pulling docker
images, execuing curl or even while copying data via ssh. And what's worse, those
errors were random, without any regularity. I've even spin up totally new
WSL2 instance with Ubuntu instead of my old Fedora VM to get rid of those errors.

After spending some time investigating, I've found issue:
[HTTPS connection if Windows is using VPN#4698](https://github.com/microsoft/WSL/issues/4698)

As it turned out, my work VPN were reconfigured, and now VM or WSL2 had to use
smaller MTU, 1350 is my case. Since tls encrypted frames weren't properly
encoded/decoded, I was receiving errors on large packets.

To set up MTU via nmcli:
```
sudo nmcli connection modify "Wired connection 1" 802-3-ethernet.mtu 1350
```

Since WSL2 doesn't have init system running, put following command in .bashrc
or, in my case, fish configuration file:

```bash
sudo ip link set dev eth0 mtu 1350
```
