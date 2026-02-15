---
title: "TIL - Building Docker Images remotely in ACR"
date: 2020-10-23


---

Today I've learned that Azure Container Registry can build Docker images for
you. Using `az` cli you're sending Dockerfile and contents of folder you're
trying to build image from. Azure will do the actual build and store resulting
image in ACR. This is pretty useful for me, since often I work from Machines
without docker installed. Also, it's just quicker.

To send the folder's contents to Azure Container Registry, build image using
the instructions in the Docker file and store image, you can use following
command:

```bash
az acr build --registry <container_registry_name> --image webimage .
```