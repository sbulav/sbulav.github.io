---
title: "Kubernetes rewrites"
date: 2020-06-03
categories:
  - #kubernetes
tags:
  - #kubernetes
  - #ingress
comments: true
---

As I work with nginx Ingress and rewrite rules on a daily basis, I spend a good
amount of time working with them. So I've decided to summarize my knowledge in
this article.

## Rewrite

[Rewrite](https://kubernetes.github.io/ingress-nginx/examples/rewrite/#rewrite)
via annotation `nginx.ingress.kubernetes.io/rewrite-target` is useful when you
have some kind of generic pattern:

```yaml
apiVersion: networking.k8s.io/v1beta1
kind: Ingress
metadata:
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /$2
  name: examplecom
spec:
  rules:
  - host: example.com
    http:
      paths:
      - backend:
          serviceName: http
          servicePort: 80
        path: /foo(/|$)(.*)
```

As rewrite shares one capture group, it can't be used for complex logic. But you
can create multiple ingresses.

## Proxy redirect

[Proxy Redirect](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/annotations/#proxy-redirect)
let's you set header Location by setting both `nginx.ingress.kubernetes.io/proxy-redirect-from`
and `nginx.ingress.kubernetes.io/proxy-redirect-to` annotations:

```yaml
apiVersion: networking.k8s.io/v1beta1
kind: Ingress
metadata:
  annotations:
    nginx.ingress.kubernetes.io/proxy-redirect-from: "foo.com"
    nginx.ingress.kubernetes.io/proxy-redirect-to: "bar.com"
  name: examplecom
spec:
  rules:
  - host: example.com
    http:
      paths:
      - backend:
          serviceName: http
          servicePort: 80
        path: /foo(/|$)(.*)
```

Which would result in following nginx config:
```
proxy_redirect foo.com bar.com;
```

This is not an actual redirect or rewrite. It lets you replace text in a header
fields of a proxied server response. Could be useful if your web server is
working with a different vHost name.

## Server snippet

[Server snippet](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/annotations/#server-snippet)
would apply your configuration in the server configuration block:

```yaml
apiVersion: networking.k8s.io/v1beta1
kind: Ingress
metadata:
  annotations:
    nginx.ingress.kubernetes.io/server-snippet: |
        rewrite ^/foo$ /bar permanent;
```

Which would result in following nginx config:

```
server {
    server_name example.com ;
...
    rewrite ^/foo$ /bar permanent;
...
}
```

It's working great and let's you release the full power of
[ngx_http_rewrite_module](https://nginx.org/en/docs/http/ngx_http_rewrite_module.html#rewrite)
but has one downside - it can be used only once per host. If you have multiple
ingresses with the same host, only one server snippet will be in the generated
Ingress nginx.conf.

## Configuration snippet

[Configuration snippet](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/annotations/#configuration-snippet)
is the thing you've been looking for. Configuration from this block is applied
to each location in generated Ingress nginx.conf:

```yaml
apiVersion: networking.k8s.io/v1beta1
kind: Ingress
metadata:
  annotations:
    nginx.ingress.kubernetes.io/configuration-snippet: |
        rewrite ^/foo$ /bar permanent;
  name: examplecom
spec:
  rules:
  - host: example.com
    http:
      paths:
      - backend:
          serviceName: http
          servicePort: 80
        path: /foo
      - backend:
          serviceName: http
          servicePort: 80
        path: /bar
```

Which would result in following nginx config:
```
server {
    server_name example.com ;
    ...
    location /foo {
        rewrite ^/foo$ /bar permanent;
        ...
    }
    location /bar {
        rewrite ^/foo$ /bar permanent;
        ...
    }
    ...
}
```

Main advantage for me in using configuration-snippet annotation is that it
allows each our service to have separate ingress, managed and applied individually.
Resulting nginx.conf handles summarized rules with complex logic.
