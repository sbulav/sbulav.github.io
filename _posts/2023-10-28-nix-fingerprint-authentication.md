---
title: "Fingerprint Authentication with fprintd on NixOS"
date: 2023-10-18
categories:
  - nix
tags:
  - nix
  - authentication
comments: true
---

## Introduction

If you're running [NixOs](https://nixos.org/)  on your laptop, and your laptop
have fingrerprint scanner, it can be very convenient to use it for
authentication. I couldn't find any articles on setting up fprintd on NixOS, so
I'll share how I've done it.

I am using [regreet](https://github.com/rharish101/ReGreet) for my
login manager, and, unfortunately, it doesn't support fingrerprint
authentication at the moment.

But, for my lock screen [swaylock](https://github.com/swaywm/swaylock) it is
supported.

## Installing fprintd

First, we need to install and enable `fprintd`:

```nix
 services.fprintd.enable = true;

 security.pam.services.swaylock = {};
 security.pam.services.swaylock.fprintAuth = true;
```

## Enrolling Fingerprints

Once `fprintd` is installed, we need to enroll our fingerprints. This registers
your fingerprints with the service so it can recognize them later for
authentication.

Run the `fprintd-enroll` command to start the interactive enrollment process(I had
to use root user to add fingerprints):

```sh
$ sudo fprintd-enroll <user>
```

You will be prompted to scan your fingers until the enrollment process is
complete.

To verify your fingerprint, run

```sh
$ fprintd-verify
```

I didn't mess with PAM or anything else to get this working.

## Logging In with a Fingerprint

To configure fingerprint for login manager, check out corresponding documentation.
For example, [SDDM](https://wiki.archlinux.org/title/SDDM#Using_a_fingerprint_reader)

To unlocking Laptop with SwayLock, just place your finger on the scanner.

## Conclusion

To me, the process was really simple. Check out the
[Fprint](https://wiki.archlinux.org/title/Fprint) for more information.

