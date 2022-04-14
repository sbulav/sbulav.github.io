---
title: "Mounting ConfigMap as single file"
date: 2020-04-21T06:00:00-04:00
categories:
  - kubernetes
tags:
  - kubernetes
comments: true
---

Many guys who work with Kubernetes don't know that you can mount ConfigMap into
existing folder inside a Pod as a single file.

In order to do so, you have to specify [subPath](https://kubernetes.io/docs/concepts/storage/volumes/#using-subpath).

For example, to replace nginx's config with one from ConfigMap:
```YAML
apiVersion: v1
kind: ConfigMap
metadata:
  name: nginx-config
  ...
data:
  nginx.conf: |
    ...some raw config string...
---

apiVersion: apps/v1
kind: Deployment

spec:
  ...
  template:
    ...
    spec:
      containers:
        ...
          volumeMounts:
            - name: nginx-config-volume
              mountPath: /etc/nginx/nginx.conf
              subPath: nginx.conf
      volumes:
      - name: nginx-config-volume
        configMap:
          name: nginx-config
```
