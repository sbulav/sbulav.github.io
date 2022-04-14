---
title: "My attempt on Certified Kubernetes Security beta Exam"
date: 2020-11-20
categories:
  - #certifications
tags:
  - #kubernetes
  - #certifications
  - #cks
comments: true
---

As a Senior Engineer at EPAM who works with Kubernetes on a daily basis I was
invited to take CKS beta exam. I didn't have time to prepare for the exam
and, considering that there were almost no information at the time except for
curriculum, I think I did pretty well.

I didn't pass the exam, but I've scored 61 out of 67, required to pass the exam.
As exam beta tester, I have free retake and I have already started my
preparations.

![Score](/assets/images/cks-no-pass.png)

Compared to old CKA version, which I pass in Feb 2020, CKS is:
- 2 hours long
- Tasks are more ambiguous
- Certification lasts only 2 years
- The CKS environment is currently running Kubernetes v1.19
- Active CKA certification is a prerequisite.

I will share a few thoughts on exam preparations below.

## Important topics

- #make sure you're familiar with kube-bench and CIS k8s Benchmarks. You must
  know how to apply kube-bench recommendations to secure you kube-api, kubelet
  and other k8s components
- #make sure you have a good knowledge of RBAC. How to map role to entity, how to
  minimize user/serviceaccount permissions.
- Usage of Admission controllers is also a must.
- NSP, PSP, Audit Policies
- Other topics in [CKS Curriculum](https://github.com/cncf/curriculum/blob/master/CKS_Curriculum_%20v1.19.pdf)


## Materials

At the time of writing, first CKS courses start to appear, but materials are
still not enough. Here's what I have in my list:
- [CKS Curriculum](https://github.com/cncf/curriculum/blob/master/CKS_Curriculum_%20v1.19.pdf)
- [Important Instructions](https://docs.linuxfoundation.org/tc-docs/certification/important-instructions-cks)
- [Aqua Security Liz Rice:Free Container Security Book](https://info.aquasec.com/container-security-book) -
  must read, even though it's a bit outdated.
- [Kubernetes-security.info](https://kubernetes-security.info/)
- [Udemy CKS course](https://www.udemy.com/course/certified-kubernetes-security-specialist/) -
  didn't take it, but looks promising
- [CKS by walidshaari](https://github.com/walidshaari/Certified-Kubernetes-Security-Specialist) -
  Extensive list of CKS resources, regularly updated.
- WIP [Kubernetes Security Essentials (LFS260)](https://training.linuxfoundation.org/training/kubernetes-security-essentials-lfs260/)
- [Kubernetes Documentation](https://kubernetes.io/docs/) - official k8s
  documentation. Since it's the only documentation you'll have available at
  exam, try to use it as much as possible and be able to find relevant topic
  quickly.

## Conclusion

As always, CKS is practice exam. Speed is everything. Create your own cluster,
break it, fix it, prepare different practice questions and test them until
you're comfortable with it.
