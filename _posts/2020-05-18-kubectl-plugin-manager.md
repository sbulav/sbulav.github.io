---
title: "Kubectl plugin manager"
date: 2020-05-18
categories:
  - #tools
tags:
  - #kubectl
  - #krew
comments: true
---

I've been aware that there is such thing as kubectl plugin manager - [krew](https://github.com/kubernetes-sigs/krew).
But [plugins](https://github.com/kubernetes-sigs/krew-index/blob/master/plugins.md)
available didn't make much sense for me, at least until now.

Lastly I'm digging into nginx ingress and do a lot of
troubleshooting of generated nginx configuration
files,so I found really useful plugin for that - [ingress nginx](https://kubernetes.github.io/ingress-nginx/kubectl-plugin/)

With `krew`, installation is a breeze:

```
kubectl krew install ingress-nginx
```


For me, most useful command is to get nginx config for specified host:

```
kubectl ingress-nginx conf -n ingress-nginx --host testaddr.local

    server {
        server_name testaddr.local ;

        listen 80;

        set $proxy_upstream_name "-";
        set $pass_access_scheme $scheme;
        set $pass_server_port $server_port;
        set $best_http_host $http_host;
        set $pass_port $pass_server_port;

        location / {

            set $namespace      "";
            set $ingress_name   "";
            set $service_name   "";
            set $service_port   "0";
            set $location_path  "/";
```

You can achieve the same using following bash script:
```
# Get nginx ingress controller pod
NGINX_POD=$(kubectl get pod -n ingress-nginx -l app=ingress-nginx | tail -n1 | cut -f1 -d" ")
# Get nginx configuration with all hosts
kubectl exec -n ingress-nginx $NGINX_POD cat /etc/nginx/nginx.conf > nginx.conf
# Get nginx configuration for specified host
sed -n "/start server \testaddr.local/,/end server \testaddr.local/p" nginx.conf > testaddr.local.txt
```

But as kubectl plugin, it's much easier to use and, it seems faster.
