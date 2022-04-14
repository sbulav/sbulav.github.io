---
title: "Preparation for CKA/CKA"
date: 2020-04-15T06:00:00-04:00
categories:
  - #certifications
tags:
  - #kubernetes
  - #certifications
  - #cka
  - #ckad
comments: true
---

I'm constantly being asked, which resources I've used to prepare to CKA/CKAD exams.

That's why I've prepared such list.

## Theory:
* Courses on Linux Academy: [CKA](https://linuxacademy.com/cp/modules/view/id/327) and [CKAD](https://linuxacademy.com/cp/modules/view/id/305).
CKA course is pretty poor, practice is sparse. CKAD course here is much better.
* [Kubernetes in Action by Marko Luksa](https://www.manning.com/books/kubernetes-in-action-second-edition)  the
best book which Ive read on Kubernetes; author explain every topic in great detail. With second edition out content is up-to-date.
* [CKAD prep course by Benjamin Muschko](https://learning.oreilly.com/learning-paths/learning-path-certified/9781492061021/)
short but extensive course, great for CKAD preparation
* Theory in [CKA-StudyGuide](https://github.com/David-VTUK/CKA-StudyGuide) repo
* [Official Kubernetes Documentation](https://kubernetes.io/docs/home/)  is a must for CKA/CKAD,
especially since youre allowed to use it on exam.
## Practice:
* I've used Vagrant spinning up 3 VMs(master+2 workers), this was enough to simulate all the tasks on the exam.
* [Kubernetes the hard way](https://github.com/kelseyhightower/kubernetes-the-hard-way) by Kelsey Hightower
* [Practice for CKA](https://github.com/David-VTUK/CKA-StudyGuide/tree/master/LabGuide) by David-VTUK
* [Practice for CKAD](https://github.com/bmuschko/ckad-crash-course) by Benjamin Muschko
* [Practice for CKAD](https://github.com/dgkanatsios/CKAD-exercises) by dgkanatsios
* I was also using Pytests testinfra and kubetest to validate my work. Writing
 tests is time-consuming but you get a good understanding how examiner will validate
 your work and how important small details are(i.e. deploy to correct namespace)

Internet is full of tips/guides on how to pass CKA/CKAD exam so all that ones really need is time
and desire to learn. And lots of practice.

