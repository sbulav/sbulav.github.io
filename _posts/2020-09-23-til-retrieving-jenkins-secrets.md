---
title: "TIL - Retrieving Jenkins secrets"
date: 2020-09-23
categories:
  - TIL
tags:
  - jenkins
comments: true
---

I'm a long-time Jenkins user. And I always thought that it's only possible to
get secrets via some kind of expose from runner.

However, there's an easy way(even scary how easy it is).
If you have access to Script Console `/scripts`, you can run following snippet to retrieve ALL
secrets:

```
com.cloudbees.plugins.credentials.SystemCredentialsProvider.getInstance().getCredentials().forEach{
  it.properties.each { prop, val ->
    if (prop == "secretBytes") {
      println(prop + "=>\n" + new String(com.cloudbees.plugins.credentials.SecretBytes.fromString("${val}").getPlainData()) + "\n")
    } else {
      println(prop + ' = "' + val + '"')
    }
  }
  println("-----------------------")
}
```

Taken from [here](https://devops.stackexchange.com/questions/2191/how-to-decrypt-jenkins-passwords-from-credentials-xml)
