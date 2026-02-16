---
title: "CKAD theory pt.7 - State persistence"
date: 2020-05-08
categories:
  - certifications
tags:
  - kubernetes
  - certifications
  - ckad
comments: true
toc: true
toc_label: "State Persistence"
---
This is part 7, last one of my personal notes I've written during preparation to CKAD.
# State persistence

* [Volumes](#volumes)
* [PersistentVolume and PersistentVolumeClaims](#persistentvolume-and-persistentvolumeclaims)

## Volumes

The internal storage of a container is `ephemeral`, meaning that it is designed to be temporary.
Ephemeral storage will disappear with container. Volumes allow you to provide more permanent
storage to a pod that exists beyond the life of container.

Here's an example of using `emptyDir` volume:

```yaml
piVersion: v1
kind: Pod
metadata:
  name: volume-pod
spec:
  containers:
  - image: busybox
    name: busybox
    command: ["/bin/sh", "-c", "while true; do sleep 3600; done"]
    volumeMounts:
    - mountPath: /tmp/storage
      name: my-volume
  volumes:
  - name: my-volume
    emptyDir: {}
```

`emptyDir` volume is first created when a Pod is assigned to a Node, and exists as long as that
Pod is running on that node. As the name says, it is initially empty. The storage disappears when
the pod leaves the node.

Among other volume types:

- nfs - mount existing CepthFS volume into a POD, supporting RWX
- iscsi
- AzureDisk - mount Azure Data Disk into a POD, only RWO
- AzureFile - mount Azure File(SMB v2.1 and 3.0) into a POD, supporting RWX
- hostPath - mount file or directory from the host into POD, just for testing!
- local - k8s 1.14+, mounted local storage device as a disk, partition or directory
- ceph - mount existing CepthFS volume into a POD, supporting RWX
- glusterfs - mount existing Glusterfs volume into a POD, supporting RWX
- secret - mount existing secret into a POD, as tmpfs
- configmap - mount existing configmap into a POD as folder or file


## PersistentVolume and PersistentVolumeClaims

`PersistentVolume` or `PV` - represents a storage

`PersistentVolumeClaim` or `PersistentVolumeClaim` - binding(desire) between a PV and and POD.

PV can be statically created by a cluster administrator, or dynamically created by the
Kubernetes API. If a POD is scheduled and requests a storage not currently available,
Kubernetes can create the underlying AzureDisk or AzureFiles storage and attach it to
the POD.

### Storage Classes

To define different tiers of storage, such as *Premium* and *Standard* you can create
a `StorageClass`. StorageClass also defines `reclaimPolicy` - controls PV after it's
no longer required.
In AKS, two StorageClasses:
- `default` - uses Azure Standard
- `managed-premium` - uses Azure Premium.
By default(no StorageClass), `default` is used.

Example of using premium + Retain:
```yaml
kind: StorageClass
apiVersion: storage.k8s.io/v1
metadata:
  name: managed-premium-retain
provisioner: kubernetes.io/azure-disk
reclaimPolicy: Retain
parameters:
  storageaccounttype: Premium_LRS
  kind: Managed
```

### PersistentVolume

Each `PV` contains spec and status. Among important spec parameters:
- `capacity` - amount of storage
- `accessModes` - which type of multi-access is supported:
  - RWO - read-write by a single POD
  - ROX - read-only by many PODs
  - RWX - ready-write by many PODs
- `storageClassName` - which category of storage to use
- `persistentVolumeReclaimPolicy` - what to do with disk after it's no longer used
  - Retain - manual reclamation
  - Recycle - automatic basic scrub(rm -rf) and return to the pool. Only NFS/HostPath
  - Delete - automatic deletion of associated cloud volume
- mountOptions - additional mount options if supported

Example PVs:
```yaml
kind: PersistentVolume
apiVersion: v1
metadata:
  name: my-pv
spec:
  storageClassName: local-storage
  capacity:
    storage: 1Gi
  accessModes:
    - ReadWriteOnce
  hostPath:
    path: "/mnt/data"
```

```yaml
kind: StorageClass
apiVersion: storage.k8s.io/v1
metadata:
  name: managed-premium-retain
provisioner: kubernetes.io/azure-disk
reclaimPolicy: Retain
parameters:
  storageaccounttype: Premium_LRS
  kind: Managed
```


### PersistentVolumeClaims

Each `PVC` contains spec and status. Among important spec parameters:
- `resources.requests.storage` - amount of storage required
- `accessModes` - which type of multi-access is supported:
- `storageClassName` - which category of storage to use
- `selector` - filter set of volumes to consume


An example of defining PVCs:

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: azure-managed-disk
spec:
  accessModes:
  - ReadWriteOnce
  storageClassName: managed-premium
  resources:
    requests:
      storage: 5Gi
```

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: my-pvc
spec:
  storageClassName: local-storage
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 512Mi
```

### Consuming storage in a POD

```yaml
kind: Pod
apiVersion: v1
metadata:
  name: my-pvc-pod
spec:
  containers:
  - name: busybox
    image: busybox
    command: ["/bin/sh", "-c", "while true; do sleep 3600; done"]
    volumeMounts:
    - mountPath: "/mnt/storage"
      name: my-storage
  volumes:
  - name: my-storage
    persistentVolumeClaim:
      claimName: my-pvc
```

```yaml
kind: Pod
apiVersion: v1
metadata:
  name: nginx
spec:
  containers:
    - name: myfrontend
      image: nginx
      volumeMounts:
      - mountPath: "/mnt/azure"
        name: volume
  volumes:
    - name: volume
      persistentVolumeClaim:
        claimName: azure-managed-disk
```

### Useful commands

```bash
kubectl explain pod.spec.volumes.persistentVolumeClaim
kubectl explain pvc
kubectl explain pv
```




# Links

- https://kubernetes.io/docs/concepts/storage/volumes/
- https://blog.nillsf.com/index.php/2019/08/28/ckad-series-part-8-state-persistence/
- https://docs.microsoft.com/en-us/azure/aks/concepts-storage
