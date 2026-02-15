---
title: "Truenas scale install fish"
date: 2022-11-09


---

Recently I bought a server that I will be using as NAS/HomeLab. My OS of choice
for this server is [TrueNas Scale](https://www.truenas.com/truenas-scale/).

It's a great OS with a polished web interface, but for HomeLab you want to play
around with it and customize a lot of things. So I thought that I'll write a
series of blog posts sharing my experience with it.

And the first one is about installing fish shell. The default shell is zsh, and
it's pretty good, but I'm used to fish.

TrueNas scale is based on the Debian, and usage of apt is restricted by
default.  Though you can make apt executable and add repos, I thought that
installing the fish deb package is more elegant. Especially considering that
adding repos and accidentally updating the TrueNas can break some of its
dependencies.

So to install fish:

1. Download fish and libpcre deb packages(Update packages to desired version):
```sh
wget http://ftp.debian.org/debian/pool/main/p/pcre2/libpcre2-32-0_10.22-3_amd64.deb
wget http://ftp.debian.org/debian/pool/main/f/fish/fish_3.5.1+ds-1_amd64.deb
```
2. Install packages:
```sh
dpkg -i libpcre2-32-0_10.22-3_amd64.deb
dpkg -i fish-3.5.1+ds-1_amd64.deb
```
3. Make sure that fish is installed and can be opened:
```sh
root@truenas[~]# which fish
/usr/bin/fish
root@truenas[~]# fish
Welcome to fish, the friendly interactive shell
Type help for instructions on how to use fish
```
4. Set fish as [default user shell](https://www.truenas.com/docs/core/coretutorials/changingdefaultshell/)
in the Web UI(fish will appear in the list of available shells after installation):

<img width="860" alt="Screenshot 2022-11-09 at 09 20 52" src="https://user-images.githubusercontent.com/28604639/200755661-d6359f35-53ae-4512-ad24-9b6bbf3b4b44.png">