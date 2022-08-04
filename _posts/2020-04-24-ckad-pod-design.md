---
title: "CKAD theory pt.5 - Observability"
date: 2020-04-24
categories:
  - certifications
tags:
  - kubernetes
  - certifications
  - ckad
comments: true
toc: true
toc_label: "Observability"
---
This is part 5 of my personal notes I've written during preparation to CKAD.

# Configuration

* [Understand how to use Labels, Selectors, and Annotations](#labels-selectors-and-annotations)
* [Understand Deployments and how to perform rolling updates](#deployments)
* [Understand Jobs and CronJobs](#jobs-and-cronjobs)

## Labels Selectors and Annotations

ConfigMaps allow you to inject text key:value pairs into the application through
the environment variables, command line arguments or files.

### Labels

Labels are key-value pairs attached th Kubernetes objects. They are used to identify or
classify objects which can in turn be used to select and group subsets of objects.
Labels do not provide uniqueness. Object can carry many labels and many objects can
carry the same label.

To attach `label` to object, put key:value in metadata:

```yaml
metadata:
  name: my-production-pod
  labels:
    app: my-app
    environment: production
```

### Selectors

Selectores are used for identifying and selecting a specific group of objects using
their labels.

There are two types of selectors:
- equinity based
    - `environment = production` , `==` is equal to `=`
    - `tier != frontend`
- set based
    - `env in (prod, qa)`
    - `tier notin (frontend, backend)`
    - `partition` include all objects with label with key `partition`
    - `!partition` include all objects without a label with key `partition`
- mixed
    - `partition in (customerA, customerB), environment!=qa`


Supported types of selectors depends on Kubernetes object. For example, service supports:
- selector - Route service traffic to pods with label keys and values matching this selector


### Annotations

Annotations are similar to labels in that they can be used to store custom metadata about objects. However,
unlike labels, annotations cannot be used to select or group objects in Kubernetes. External tools can read,
write and interact with annotations.

```yaml
metadata:
  name: my-annotation-pod
  annotations:
    owner: test@gmail.com
    git-commit: 01j1290dj
```

## Deployments

Deployments provide a way to manage a set of replica pods. Deployment defines a desired state for the
replica pods. The cluster will handle all actions, required to reach that state, by itself.

Deployment spec consists of following components:
- spec.replicas - the number of replica pods
- spec.selector - which pods in current namespace to manage
- spec.template - how to create new pods, which labels, images, etc to assign to newly created pods


By default, Deployment uses `RollingUpdateStrategy`, to create/terminate PODs in batches.

Very important that `spec.selector` mathes `spec.template.matadata.labels`, otherwise Deployment won't
be able to manage old PODs. Selector shouldn't be modified during Deployment lifecycle.

An example of Deployment:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.7.9
        ports:
        - containerPort: 80
```

### Rolling Updates and Rollbacks

Deployment in updates when POD's template is changed, i.e. container image is changed. Scaling
Deployment do not trigger the rollout.

By default, during deployment only a certain number of Pods(25%) may be down - `maxUnavailable`.
Also a certain number of PODs can be created above desired number of PODs(25%) - `maxSurge`.

To watch rollout history, use `kubectl rollout history deploy/nginx` command. You may see empty
change-cause fields. To fill change-cause, run kubectl with `--record` argument or
manually fill in the `meta.annotations: kubectl.io/change-cause` field.

Example workflow, showing rolling out process

```bash
# Update image
kubectl set image deployment/rolling-deployment nginx=nginx:1.7.9 --record
# Explore revision 2
kubectl rollout history deployment/rolling-deployment --revision=2
# Roll bask to revision 1
kubectl rollout undo deployment/rolling-deployment --to-revision=1
# Undo stuck rollout
kubectl rollout undo deployment/rolling-deployment
# Restart rollout
kubectl rollout restartdeployment/rolling-deployment
```

### Jobs and CronJobs

Kubernetes provides the ability to easily run container workloads in a distributed cluster,
but not all workloads need to run constantly. With jobs, we can run container workloads until
they complete, then shut down the container. CronJobs allow us to do the same, but re-run the
workload regularly according to a schedule. In this lesson, we will discuss Jobs and CronJobs
and explore how to create and manage them.


#### Jobs

Jobs can be used to reliably execute workload until it completes. The job will create one or more
PODs. When the job is finished, POD(s) will remain in `completed` state. This is done for you to
inspect job logs. You have to remove old jobs manually.

An example of job definition:
```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: pi
spec:
  template:
    spec:
      containers:
      - name: pi
        image: perl
        command: ["perl",  "-Mbignum=bpi", "-wle", "print bpi(2000)"]
      restartPolicy: Never
  backoffLimit: 4
```

This job contains `backoffLimit` parameter, which defines how many times job should be restarted if it
fails.


#### CronJobs

CronJobs provide functionality to run a Job on a periodic schedule. To do this, we define `JobTemplate`,
where we can define the Job.

CronJob can be started from CLI:
```bash
kubectl run hello --schedule="*/1 * * * *" --restart=OnFailure --image=busybox -- /bin/sh -c "date; echo Hello "
```

or by defining full spec:
```yaml
apiVersion: batch/v1beta1
kind: CronJob
metadata:
  name: hello
spec:
  schedule: "*/1 * * * *"
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: hello
            image: busybox
            args:
            - /bin/sh
            - -c
            - date; echo Hello from the Kubernetes cluster
          restartPolicy: OnFailure
```

# Links
https://kubernetes.io/docs/concepts/workloads/controllers/deployment/
https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/
https://kubernetes.io/docs/tasks/job/automated-tasks-with-cron-jobs/
https://blog.nillsf.com/index.php/2019/08/05/ckad-series-part-6-pod-design/
