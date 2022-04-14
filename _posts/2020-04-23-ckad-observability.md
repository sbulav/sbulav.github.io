---
title: "CKAD theory pt.4 - Observability"
date: 2020-04-23T06:00:00-04:00
categories:
  - #certifications
tags:
  - #kubernetes
  - #certifications
  - #ckad
comments: true
toc: true
toc_label: "Observability"
---
This is part 4 of my personal notes I've written during preparation to CKAD.

# Multi-Container Pods

* [Understand LivenessProbes and ReadinessProbes](#liveness-and-readiness-probes)
* [Understand container logging](#container-logging)
* [Monitoring applications](#monitoring-applications)
* [Debugging](#debugging)


## Liveness and Readiness Probes

Probes allow you to change how k8s treats state of your containers. Using probes, we can change when
k8s starts sending traffic to container and when container is considered dead and should be restarted.
You can change what is checked and how often it's checked using specific handlers.


There are three types of checks that k8s can perform:
- ExecAction - execute specific command inside the pod. Exit code should be 0.
- TCPSocketAction - perform TCP check on a specified container's port. Port should be open
- HTTPGetAction - perform HTTP GET request against container on a specified port and path. For check to 
  be considered successfull, exit code should be between 200 and 400.

### Liveliness probe

`livenessProbe` - performs sanity check, that application is running and in normal operational state. If
check is failed, kubelet will kill the Container.

```YAML
spec:
  containers:
    - name: nginx-1
      image: nginx
      livenessProbe:
        httpGet:
          path: /healthy.html
          port: 80
```

### Readiness probe

`readinessProbe` - performs ready to serve check, that application is ready to handle requests. When readiness
probe succeeds, container's IP address is added to Service Endpoints.

```YAML
spec:
  containers:
    - name: nginx-1
      image: nginx
      readinessProbe:
        httpGet:
          path: /index.html
          port: 80
```

### Probe options

Probes have a number of options that can change their behaviour:
- initialDelaySecond - number of seconds to wait before start running periodic checks
- periodSeconds - how often(in seconds) to perform the check. Default=10, min=1
- timeoutSeconds - number of seconds after probe times out. Default=1, min=1
- successThreshold - minimum consecutive successes for the probe to be considered successful after fail. Default=1,min=1, must be 1 for liveness
- failureThreshold - minimum consecutive failures for the probe to be considered failed. For liveness=restart, readiness=unready. Default=3,min=1

HTTP probe options:
- host  - defaults to pod IP.
- scheme - http/https. defaults to http
- path - path in url
- httpHeaders - custom headers set in request
- port - between 1 and 65535



## Container logging

In k8s it is expected that application will put their logs to stdout. This output is captured by k8s and can
be accessed using `kubectl logs <container>`. In case there are many containers in the pod, use
`kubectl logs -c <container>`.

Important thing to notice that k8s doesn't keep the logs if a container crashes, pod is evicted or a node
dies - it's expected that you'll use external solution for that. Main variants are:
- Elasticsearch and Kibana
- StackDriver - GKE default
- Azure Monitor - Azure default



## Monitoring applications

The Kubernetes metrics server provides an API which allows you to access data about your pods and
nodes, such as CPU and memory usage. By default, k8s does not have metrics server installed and you
have to install it by your own.

Metrics server provide a limited set of metrics but it's light-weight.

For a complete rich set of metrics consider installing Prometheus.

### Installing Metrics Server

One way to install k8s metrics server is to use following commands:

```bash
DOWNLOAD_URL=$(curl --silent "https://api.github.com/repos/kubernetes-incubator/metrics-server/releases/latest" | jq -r .tarball_url)
DOWNLOAD_VERSION=$(grep -o '[^/v]*$' <<< $DOWNLOAD_URL)
curl -Ls $DOWNLOAD_URL -o metrics-server-$DOWNLOAD_VERSION.tar.gz
mkdir metrics-server-$DOWNLOAD_VERSION
tar -xzf metrics-server-$DOWNLOAD_VERSION.tar.gz --directory metrics-server-$DOWNLOAD_VERSION --strip-components 1
kubectl apply -f metrics-server-$DOWNLOAD_VERSION/deploy/1.8+/
```

Give 5 minutes to deploy and verify that metrics is running by issuing following command:

```bash
kubectl get --raw /apis/metrics.k8s.io/
```

### Monitoring application utilization

With metric server up and running, you can use following commands:
- `kubectl top nodes` - show information about CPU/Memory utilization across nodes in your cluster
- `kubectl top pods` - show information about all your pods in default namespace
- `kubectl top pod` <podname> - show information about single pod


## Debugging

Debugging an application consists of 2 steps:
1. Find the issue
2. Fix the issue

When application is not working or is not working as expected, start finding the issue by checking
PODs, Replication Controllers and Services. It's also worth checking nodes utilization, volumes and
port bindings.

According to a survey, top 10 reasons for POD to fail:
1. Wrong Container Image / Invalid Registry Permissions
  * The image tag is incorrect
  * The image doesn't exist
  * Kubernetes doesn't have permissions to pull that image
  * Errors: `ErrImagePull` or `ImagePullBackOff`
2. Application Crashing after Launch
  * Incorrect permissions in the POD
  * Missing Environment variables
  * Missing mounted volumes
  * Errors: `CrashLoopBackOff`
3. Missing ConfigMap or Secret
  * Errors: `RunContainerError`, hung in `ContainerCreating`
4. Liveness/Readiness Probe Failure
  * Incorrect health URL
  * Incorrect startup timeout
  * Database misconfiguration
  * Errors: `NotReady`, `Terminated`
5. Exceeding CPU/Memory Limits
  * Errors: `FailedCreate`
6. Resource Quotas
  * Errors: `FailedCreate`, `Terminated`
7. Insufficient Cluster Resources
  * Even if resources no fully utilized they can be fully accounted by the Scheduler
  * Errors: `FailedScheduling`
8. PersistentVolume fails to mount
  * No free PV
  * PV not accessible by the POD
  * Errors: Pod hung in `ContainerCreating`
9. Validation Errors
  * Syntax errors in object definition
  * Incorrect indentation
10. Container Image not updating
  * Incorrect Image pull policy i.e. `IfNotPresent` results in containers not being pulled if same tag exists on the node

### Debugging a POD

Most important command to start your POD troubleshooting:
- `kubectl get pods` - show basic POD info. Worth comining with `-o wide` and `-o yaml` flags
- `kubectl describe pod` - provide detailed information on POD and latest events.
- `kubectl logs <podname>` - print stdout from the POD.

When you've found an issue, you can modify object on-the-fly by issuing `kubectl edit` command. However,
not all object can be modified in memory. Though deprecated, `kubectl get --export` can provide a clean
YAML that can be reapplied later.


### Debugging a Service

To troubleshoot a Service, use following commands:
- `kubectl get service`
- `kubectl describe endpoints`

# Links

- https://blog.nillsf.com/index.php/2019/08/01/ckad-part-5-observability/
- https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#container-probes
- https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/
- https://kubernetes.io/docs/tasks/debug-application-cluster/resource-usage-monitoring/
- https://kubernetes.io/docs/tasks/debug-application-cluster/debug-pod-replication-controller/
- https://kukulinski.com/10-most-common-reasons-kubernetes-deployments-fail-part-1/
