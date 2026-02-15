---
title: "TIL - Free wildcard domain xip.io"
date: 2020-07-03


---

Sometimes you need to test your application quickly, and setting up new DNS domain,
especially in Enterprise, can take ages.
Today I learned about [xip.io](https://xip.io), a `magic domain name` that provides wildcard DNS
for any IP address. Example from their web site: if you IP address is 10.0.0.1.
```
Using xip.io,

      10.0.0.1.xip.io   resolves to   10.0.0.1
      www.10.0.0.1.xip.io   resolves to   10.0.0.1
      mysite.10.0.0.1.xip.io   resolves to   10.0.0.1
      foo.bar.10.0.0.1.xip.io   resolves to   10.0.0.1
```

What's even better, [xip.io](https://xip.io) is supported natively by Rancher,
which can generate an xip.io hostname, which in it's turn makes it useful for
development or demonstration purposes.

So, to test your new shiny ingress, you can use following DNS entry:

```
<app-name>.<rancher-project>.<nginx-ingress-controller-ip>.xip.io
```