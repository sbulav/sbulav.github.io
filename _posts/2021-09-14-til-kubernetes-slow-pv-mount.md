---
title: "TIL - Kubernetes slow PV mount"
date: 2021-09-15
categories:
  - TIL
tags:
  - kubernetes
comments: true
---

During my investigation of Pods taking a long time to start (20+ minutes) I saw
following message in Pod's logs:

```bash
unmounted volumes=[pod-home], unattached volumes=[ │
│ z-config pod-home config plugin-dir []: timed out waiting for the condition
```

I figured out that PVs are unavailable for reattaching as, due to enforced
`fsGroup`, every time before mounting PV, SetVolumeOwnership() is run against
the volume. For small volumes, this is not an issue, but when your volume grows
in size, it takes more and more time, easily passing 30 minutes.

Check [Timeout expired waiting for volumes to attach #67014](https://github.com/kubernetes/kubernetes/issues/67014)
for more details. 

If your clusters are on 1.20+ you can use `fsGroupChangePolicy` to skip
recursive chown if root of the volume has the correct permissions:

```YAML
securityContext:
  runAsUser: 1000
  runAsGroup: 3000
  fsGroup: 2000
  fsGroupChangePolicy: "OnRootMismatch"
```

Otherwise, you can use `supplementalGroups` as temporary workaround.
