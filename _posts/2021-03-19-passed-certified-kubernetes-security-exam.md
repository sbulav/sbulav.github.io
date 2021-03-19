---
title: "Passed Certified Kubernetes Security Exam"
date: 2021-03-19
categories:
  - certifications
tags:
  - kubernetes
  - certifications
  - cks
comments: true
---

I've passed Certified Kubernetes Security Specialist Exam with score 84%:
![Score](/assets/images/cks-passed.png)
This also means that now I obtain all three Kubernetes Certifications from
LinuxFoundation(CKAD, CKA and CKS).

Compared to my [previous attempt on beta exam](https://sbulav.github.io/certifications/certified-kubernetes-security-beta/)
I was well prepared, but still could feel time pressure. Exam itself felt
more polished and thoughtful compared to beta, but I was lucky enough to face a
couple bugs(Like not matching names in question and in k8s cluster).

I didn't use any courses or exam simulators, slowly going through theory
and practice. I have to say that even though this way gives you a lot of
low level knowledge, it's so time consuming that I couldn't recommend it
to anyone. I think that the most straightforward way to pass CKS exam at the
moment is to buy [Kubernetes CKS 2021 Complete Course + Simulator](https://www.udemy.com/course/certified-kubernetes-security-specialist/)
on Udemy.

Most difficult thing for me was setting up my own Lab environment, especially
considering how many components are involved into exam. I even wrote a few
posts describing [my CKS prep experience](https://sbulav.github.io/tags/#cks).

I will share more details how I was preparing to CKS exam below.

# Theory

## Important topics

They are the same as they were on beta:
- Make sure you're familiar with `kube-bench` tool and CIS k8s Benchmarks. You
  must know how to apply `kube-bench` recommendations to secure your
  `kube-api`, `kubelet` and other k8s components
- Make sure you have a good knowledge of RBAC. How to map role to entity, how to
  minimize user/serviceAccount permissions.
- Usage of Admission controllers is also a must.
- NSP, PSP, OPA, Audit Policies
- Other topics in [CKS Curriculum](https://github.com/cncf/curriculum/blob/master/CKS_Curriculum_%20v1.20.pdf)

## Materials

Again, most of the materials are the same one I used for beta exam:

- [CKS Curriculum](https://github.com/cncf/curriculum/blob/master/CKS_Curriculum_%20v1.20.pdf)
- [CKS Important Instructions](https://docs.linuxfoundation.org/tc-docs/certification/important-instructions-cks)
- [Aqua Security Liz Rice:Free Container Security Book](https://info.aquasec.com/container-security-book) -
  must read, even though it's a bit outdated.
- [Kubernetes-security.info](https://kubernetes-security.info/)
- [Udemy CKS course](https://www.udemy.com/course/certified-kubernetes-security-specialist/) -
  I think it's the best resource at the moment for CKS exam preparations
- [CKS by walidshaari](https://github.com/walidshaari/Certified-Kubernetes-Security-Specialist) -
  Extensive list of CKS resources, regularly updated.
- [Kubernetes Security Essentials (LFS260)](https://training.linuxfoundation.org/training/kubernetes-security-essentials-lfs260/) -
  official training course, though heard that mediocre
- [Kubernetes Documentation](https://kubernetes.io/docs/) - official k8s
  documentation.

# Practice

I've used following resources for practice:
- [CKS Exam series by killer.sh](https://itnext.io/cks-exam-series-1-create-cluster-security-best-practices-50e35aaa67ae)
- [CKS course environment by killer.sh](https://github.com/killer-sh/cks-course-environment)
- [CKS course environment by zealvora](https://github.com/zealvora/certified-kubernetes-security-specialist)

I'd suggest starting with creating your lab environment and solving questions from
CKS Exam series.

If you feel brave enough, you can create your own practice exam, like I did.
For example, my practice exam consists of 16 questions and is pretty close to the
real one. Unfortunately I can't share it due to NDA.

## Exam tips

As CKS has the same format as CKA, all tips for CKA(which internet is full of),
can be applied to CKS. But I'll still share a few from my side:

* Create bash aliases.

Spend 30 seconds to create bash aliases, which can save you much more time
during the whole exam. My favourite one is `kubens`:
```bash
alias kubens='kubectl config set-context --current --namespace '
```

* Know how to configure and use Vim.

I drop following lines to `.vimrc` to make work more comfortable:
```vim
set ai et sw=2 sts=2 hidden
```

Those options make work with YAML less painful:
* ai = autoindend - Copy indent from current line when starting a new line
  (typing <CR> in Insert mode or when using the "o" or "O" command). 
* et = expandtab - In Insert mode: Use the appropriate number of spaces to
  insert a <Tab>.
* sw = shiftwidth - Number of spaces to use for each step of (auto)indent.
* sts = Number of spaces that a <Tab> counts for while performing editing
  operations, like inserting a <Tab> or using <BS>.
* hidden - lets you jump between vim buffers without save, useful for `gf`

Before pasting block of code, use `:set paste` command to preserve formatting.

One or multiple lines can be easily shifted left or right with `<<` or `>>`. It's
works on visual blocks as well.

You can toggle built-in path auto completion with `C-x, C-f`.

Using `gf` it's possible to open file under your cursor, and `C-o` can be used
to jump back.

Finally, you can run something like `k edit po mypod` and then write yaml to
local folder with `:w mypod.yaml`

* Use bookmarks

One really useful link which I didn't saw in similar posts is [Website Content
examples](https://github.com/kubernetes/website/tree/master/content/en/examples/).
It's easy to find any resource example there, as they're already in YAML and
you can use this link on exam.

# Setting up your own lab

Carefully crafting test questions, I was able to make all questions work
together with one Kubernetes cluster and 2 worker nodes. 

For provisioning I used Vagrant with following VMs:
- master
  - Ubuntu 18.04(the same version as on exam)
  - 2CPU, 2GB RAM
  - all questions related to hardening k8s components, audit, admission 
  controllers, Trivy, etc..
- worker1
  - Ubuntu 18.04
  - 2CPU, 2GB RAM
  - Uses docker runtime and responsible for questions with AppArmor, Image
  security scanning, investigating Falco/Sysdig 
- worker2
  - Ubuntu 18.04
  - 2CPU, 2GB RAM
  - Uses containerd runtime and responsible for gVisor.

The trick here is to use labels to assign pods to correct nodes.

## Testing your solutions

I think that it's important to validate your solutions every time you pass
your test exams, and here's why:
- CKS has strict time limits, so you have to speed up
- When you're trying to increase your speed, you start making little errors,
like typos, creating Pods in different namespaces, etc..
- Each typo can lead to whole question failed
- Some questions have multiple bullet-ins and it's easy to miss one of them

For testing, I was using Python's [pytest](https://docs.pytest.org/en/stable/)
testing framework and it's plugin [kubetest](https://kubetest.readthedocs.io/en/latest/)

`Pytest` can be used when you need to check output of a command, or when
`kubetest` doesn't yet support required Kubernetes resource.

For example, here's how you can check that ETCD is properly configured and
passed `kube-bench` test:
```python
def test_cks_question2_kube_bench_etcd(host):
    """
        Test that etcd passes kube-bench
    """
    cmd = host.run("/home/vagrant/kube-bench  --exit-code=99 --nosummary --noremediations --nototals --group 2")
    assert cmd.rc == 0
```

In this example I'm checking that result file exists and contains correct
entries:
```python
def test_cks_question7_result(host):
    """ Test that result file exists and contains logs """

    assert host.file("/home/vagrant/result/question7-logs.txt").exists
    result = host.file("/home/vagrant/result/question7-logs.txt").content_string

    assert '/docker-entrypoint.sh: 13: /docker-entrypoint.sh: cannot create /dev/null: Permission denied' in result
```

`Kubetest` is worth using for checking k8s resource state. For example, here's
how you can check that node has correct labels:
```
def test_cka_question7_check_node_labels(kube):
    """ Test that node has correct labels """

    nodes = kube.get_nodes()
    assert 'worker2' in nodes

    node = nodes['worker2']
    assert node.obj.metadata.labels.get("security") == "apparmor"
```

This can be done with pure `pytest` and parsing `kubectl` output, but with
`kubetest` tests are cleaner and more flexible:
```python
import pytest

@pytest.mark.namespace(create=False, name='production')
def test_cks_question11(kube):
    """ Test that pods with  vulnerabilities are deleted and others are in
        place
    """
    pods = kube.get_pods()
    assert 'secpod01' in pods
    assert 'secpod02' in pods
    assert 'secpod03' not in pods
    assert 'secpod04' not in pods
```

Finally, advanced features like [parametrization](https://docs.pytest.org/en/stable/parametrize.html)
can be used to make complicated testing easy like a breeze:
```python
import pytest

@pytest.mark.parametrize('command, answer', [
  ("update pods", "no"),
  ("get pods", "yes"),
  ("get statefulsets", "no"),
  ("update statefulsets", "yes")
])
def test_cks_question3_perms(host, command, answer):
    """ Test that ServiceAccount has correct permissions """

    cmd_pre = "kubectl --as=system:serviceaccount:web:frontend-sa -n webauth can-i " + command
    cmd = host.run(cmd_pre)
    assert cmd.stdout.strip() == answer
```

Testing is a broad and very interesting topic. Personally I write test for
all my exams and find them very useful.

## Conclusion

CKS is a great exam, passing which you can be proud of. CKS topics are pretty
specific and probably aren't used by most of developers working with Kubernetes.
But if you decide to go for it, make sure you're well prepared.

Good luck with your own Certified Kubernetes Security Specialist!
