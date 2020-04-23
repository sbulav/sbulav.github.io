---
title: "TIL - Validating Jenkins Pipeline from CLI"
date: 2020-04-24T05:00:00-04:00
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

Here's commands that worked for me:
```bash
JENKINS_URL=https://jenkins.example.com
USER=user
PASSWORD=password
JENKINS_CRUMB=`curl -s -u $USER:$PASSWORD "$JENKINS_URL/crumbIssuer/api/xml?xpath=concat(//crumbRequestField,\":\",//crumb)"`
curl -X POST -u $USER:$PASSWORD -H $JENKINS_CRUMB -F "jenkinsfile=<Jenkinsfile" $JENKINS_URL/pipeline-model-converter/validate
```

I've integrated them into my Makefile and linting pipelines,and
now I'm receiving nice error messages, like:
```text
Errors encountered validating Jenkinsfile:
WorkflowScript: 135: expecting '}', found '' @ line 135, column 1.
```
