---
title: "CKAD theory pt.2 - Configuration"
date: 2020-04-17T06:00:00-04:00
categories:
  - #certifications
tags:
  - #kubernetes
  - #certifications
  - #ckad
comments: true
toc: true
toc_label: "Configuration"
---
This is part 2 of my personal notes I've written during preparation to CKAD.

# Configuration

* [Understand ConfigMaps](#configmaps)
* [Understand SecurityContexts](#security-contexts)
* [Define an application’s resource requirements](#resource-requirements)
* [Create & consume Secrets](#secrets)
* [Understand ServiceAccounts](#service-accounts)

## ConfigMaps

ConfigMaps allow you to inject text key:value pairs into the application through
the environment variables, command line arguments or files.

### Creating ConfigMaps

#### Creating ConfigMaps from CLI

ConfigMaps can be created using CLI from literal or from file or even from directory:

```bash
kubectl create configmap my-config --from-literal=key1=config1 --from-literal=key2=config2
```

```bash
echo "keyTest:valueTest"> key.txt
kubectl create configmap my-config --from-file=path/to/bar
```

#### Creating ConfigMaps from YAML

Using `--from-file` actually loads the file, and using `--from-env-file` loads the actual values in the file.
i.e. it will result in setting key with a name of a file

```text
Data
====
configfile.txt:
----
MYNAME=JohnSmith
SECONDNAME=Test
```

Example ConfigMap in YAML:

```YAML
apiVersion: v1
kind: ConfigMap
metadata:
  name: my-config-map
data:
  myKey: myValue
  anotherKey: anotherValue
```

### Assigning ConfigMaps to pods

One or multiple ConfigMaps can be assigned to pod and populated as environment variables or as a Volume

#### Assigning ConfigMaps as environment

You can assign a specific value from ConfigMap as environment variable:

```YAML
spec:
  containers:
  - name: myapp-container
    image: busybox
    env:
    - name: ENV_VAR_IN_POD
      valueFrom:
        configMapKeyRef:
          name: my-config-map
          key: myKey
```

Also it's possible to assign all of the ConfigMaps's data as container environment variables

```YAML
spec:
  containers:
    - name: test-container
      ...
      envFrom:
      - configMapRef:
        name: special-config-cm
```


#### Assigning ConfigMaps as volumes

```YAML
apiVersion: v1
kind: Pod
metadata:
  name: my-configmap-volume-pod
spec:
  containers:
  - name: myapp-container
    image: busybox
    command: ['sh', '-c', "echo $(cat /etc/config/myKey) && sleep 3600"]
    volumeMounts:
      - name: config-volume
        mountPath: /etc/config
  volumes:
    - name: config-volume
      configMap:
        name: my-config-map
```

## Security Contexts

Security context  defines privelege and access control settings for a Pod or Container. They Control interaction
between host and containers.

Security contexts can be defines at the POD level or for more specifically for each container. In this case, specific
rules take priority.

List of settings include:
- DAC. UID/GID
- SELinux
- Privileged mode
- Capabilities
- Apparmor
- Seccomp
- AllowPrivilegeEscalation - whether a process can gain more privileges than its parent process

Options to set:
-runAsUser - sets the UID of the processes
-runAsGroup - sets the GID of the processes
-fsGroup - set the secondary group of the processes

### Running a POD with UID/GID

Run any containers in the POD(all their processes) with UID 1000 and GID 3000 in the POD. It also sets secondary group
to 2000.
```YAML
spec:
  securityContext:
    runAsUser: 1000
    runAsGroup: 3000
    fsGroup: 2000
```

### Running a POD in privileged mode

Use privileged mode to gain full access to underlying worker host.

```YAML
spec:
  securityContext:
    privileged: true
```


## Resource requirements

Each container inside a POD can be configured with minimal requirements and maximum allowed usage of CPU or memory.

If a Container exceeds its memory limit, it might be terminated. If it is restartable, the kubelet will restart it.

A Container might or might not be allowed to exceed its CPU limit for extended periods of time.
However, it will not be killed for excessive CPU usage.

* CPU counted in millicpus with abbreviation of `100m`. 1CPU = 1000 millicpus, 0.5 CPU = 500m

* Memory in two different notation
    - E, P, T, G, M, K
    - Ei, Pi, Ti, Gi, Mi, Ki
  For example, 129M = 129 MegaBytes = 123 Mebibytes = 128974848. Another example: M is 1,000,000 and Mi is 1,048,576.

Important thing to notice is that requests are reserved, and are not linked to the actual usage on your cluster.
So with incorrect requests, you can run a very underutilized cluster.


### Resource requests

An example of container that requires 64 Megabytes of memory and 0.25CPU to run:

```YAML
spec:
  containers:
  - name: myapp-container
    image: busybox
    resources:
      requests:
        memory: "64Mi"
        cpu: "250m"
```

### Resource limits

An example of container that limits usage by 128 Megabytes of memory and 0.5CPU:

```YAML
spec:
  containers:
  - name: myapp-container
    image: busybox
    resources:
      limits:
        memory: "128Mi"
        cpu: "500m"
```


## Secrets

Secrets is an object that contains small amount of sensitive information such as passwords,
keys or tokens. Secrets stored using base64 encryption and can be decoded
using `echo 'base64pw' | base64 --decode`.

### Creating Secrets

#### Creating Secrets from CLI

```bash
kubectl create secret generic my-secret --from-literal=key1=supersecret
```

#### Creating Secrets from YAML

Secrets can be created using base64 encrypted values using `data` field or in unencrypted version using `stringData` field:

```YAML
apiVersion: v1
kind: Secret
metadata:
  name: mysecret
type: Opaque
data:
  password: MWYyZDFlMmU2N2Rm
stringData:
  user: admin
```

### Assigning Secrets to PODs

Secrets can be mounted as volumes or exposed as Environment variables to a POD.

#### Assigning Secrets as volumes

```YAML
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
  - name: mypod
    image: redis
    volumeMounts:
    - name: foo
      mountPath: "/etc/foo"
      readOnly: true
  volumes:
  - name: foo
    secret:
      secretName: mysecret
```

#### Assigning Secrets as Environment variables

```YAML
apiVersion: v1
kind: Pod
metadata:
  name: secret-env-pod
spec:
  containers:
  - name: mycontainer
    image: redis
    env:
      - name: SECRET_USERNAME
        valueFrom:
          secretKeyRef:
            name: mysecret
            key: username
      - name: SECRET_PASSWORD
        valueFrom:
          secretKeyRef:
            name: mysecret
            key: password
  restartPolicy: Never
```


## Service accounts

ServiceAccounts allow container running in pods to access Kubernetes API. Some applications
may need to interact with cluster itself and ServiceAccount provide a way for them to do so.
If ServiceAccount is not set, POD is using `default` SA. Access to API is controlled via token.

### Create a new ServiceAccount in CLI

```bash
kubectl create serviceaccount my-service-account
```


### Assign ServiceAccount to a POD

```YAML
apiVersion: v1
kind: Pod
metadata:
  name: my-serviceaccount-pod
spec:
  serviceAccountName: my-serviceaccount
  containers:
  - name: myapp-container
    image: busybox
    command: ['sh', '-c', "echo Hello, Kubernetes! && sleep 3600"]
```


# Links
https://blog.nillsf.com/index.php/2019/07/21/ckad-series-part-3-configuration/

