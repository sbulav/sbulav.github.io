---
title: "TIL - Validating Jenkins Pipeline from CLI"
date: 2020-04-22
categories:
  - TIL
tags:
  - jenkins
comments: true
---

During last couple of days I've been developing Jenkins CI and CD pipelines.
Since I'm get used to Python's linting tools like flake8 workflow where you have
to modify your pipeline in Jenkins "replay", validate there and only then copy
to Jenkinsfile was just killing me.

Today I learned that you can easily [validate pipeline from CLI](https://jenkins.io/doc/book/pipeline/development/#linter)
Unfortunately, examples there didn't work for me, so I had to spend some time
trying to get them working.

Here's commands what's worked for me:
```bash
DOWNLOAD_URL=$(curl --silent "https://api.github.com/repos/kubernetes-incubator/metrics-server/releases/latest" | jq -r .tarball_url)
DOWNLOAD_VERSION=$(grep -o '[^/v]*$' <<< $DOWNLOAD_URL)
curl -Ls $DOWNLOAD_URL -o metrics-server-$DOWNLOAD_VERSION.tar.gz
mkdir metrics-server-$DOWNLOAD_VERSION
tar -xzf metrics-server-$DOWNLOAD_VERSION.tar.gz --directory metrics-server-$DOWNLOAD_VERSION --strip-components 1
kubectl apply -f metrics-server-$DOWNLOAD_VERSION/deploy/1.8+/
```
