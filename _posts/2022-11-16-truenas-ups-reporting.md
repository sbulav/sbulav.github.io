---
title: "Truenas Scale UPS reporting"
date: 2022-11-17
categories:
  - truenas
tags:
  - truenas
  - ups
comments: true
---

I continue my adventures with TrueNas Scale. After [configuring UPS](https://sbulav.github.io/truenas/truenas-ups-huawei2000/)
I wanted to see UPS graphs in the reporting page, but they were empty.

As it turns out, now reporting for UPS is broken, and you have to dig deep
to make it work due to following reasons:
* CollectD Debian mainterners disabled nut plugin starting with 5.9
  [changelog](https://metadata.ftp-master.debian.org/changelogs//main/c/collectd/collectd_5.12.0-7_changelog)
* NUT was removed from middlewared reporting plugin [commit](https://github.com/truenas/middleware/commit/70de86b75f055c801a61622618a9a35d2948297a)

Considering all that, I definitely wouldn't recommend spending time on it and
making reporting work. But if you're ready for possible crashes or breaks on
each update, you can follow me with the steps below.

## Install missing CollectD nut plugin

This can be done via compiling [CollectD](https://github.com/collectd/collectd),
but much easier for me was to extract lib from old package:

```sh
wget http://ftp.de.debian.org/debian/pool/main/c/collectd/collectd-core_5.8.1-1.3_amd64.deb
dpkg -x collectd-core_5.8.1-1.3_amd64.deb /tmp/out
/tmp/out/usr/lib/collectd/nut.so
cp /tmp/out/usr/lib/collectd/nut.so /usr/lib/collectd/
```

## Enable nut CollectD plugin

Add following lines to the collectd configuration:

```sh
LoadPlugin nut

<Plugin "nut">
  UPS "ups@127.0.0.1:3494"
</Plugin>
```

Make sure the UPS address matches the one you've used with `uspc` commend.

And restart CollectD daemon:

```sh
systemctl restart collectd
```

After restart, you should see `*.rrd` files:
```
root@truenas ~# ll /var/db/collectd/rrd/127.0.0.1/nut-ups/*
-rw-r--r-- 1 root root 148648 Nov 17 12:12 /var/db/collectd/rrd/127.0.0.1/nut-ups/current-output.rrd
-rw-r--r-- 1 root root 148648 Nov 17 12:12 /var/db/collectd/rrd/127.0.0.1/nut-ups/frequency-input.rrd
-rw-r--r-- 1 root root 148648 Nov 17 12:12 /var/db/collectd/rrd/127.0.0.1/nut-ups/frequency-output.rrd
lrwxrwxrwx 1 root root      7 Nov 16 18:54 /var/db/collectd/rrd/127.0.0.1/nut-ups/nut-ups -> nut-ups
-rw-r--r-- 1 root root 148648 Nov 17 12:12 /var/db/collectd/rrd/127.0.0.1/nut-ups/percent-charge.rrd
-rw-r--r-- 1 root root 148648 Nov 17 12:12 /var/db/collectd/rrd/127.0.0.1/nut-ups/percent-load.rrd
-rw-r--r-- 1 root root 148648 Nov 17 12:12 /var/db/collectd/rrd/127.0.0.1/nut-ups/temperature-ups.rrd
-rw-r--r-- 1 root root 148648 Nov 17 12:12 /var/db/collectd/rrd/127.0.0.1/nut-ups/timeleft-battery.rrd
-rw-r--r-- 1 root root 148648 Nov 17 12:12 /var/db/collectd/rrd/127.0.0.1/nut-ups/voltage-battery.rrd
-rw-r--r-- 1 root root 148648 Nov 17 12:12 /var/db/collectd/rrd/127.0.0.1/nut-ups/voltage-input.rrd
-rw-r--r-- 1 root root 148648 Nov 17 12:12 /var/db/collectd/rrd/127.0.0.1/nut-ups/voltage-output.rrd
```


## Make RRD visible to middlewared

The way CollectD creates folder for the NUT is that it's using UPS address
as folder name. This way, middlewared does not see those files [more info](https://www.truenas.com/community/threads/ups-nut-plugin-collectd-data-fields.91020/)

This can be fixed with symlink:

```sh
ln -s /var/db/collectd/rrd/127.0.0.1/nut-ups/ /var/db/collectd/rrd/localhost/nut-ups
```

## Update middlewared plugins.py

As I already mentioned, right now NUT support is removed from the middlewared
reporting plugin.

But it's just a simple python script, which everyone can fix. I've forked the
repo, restoring NUT and adding couple additional Graphs [plugins.py](https://github.com/sbulav/middleware/blob/eafa00d82e8382b331b992a69a307d8dfd523989/src/middlewared/middlewared/plugins/reporting/plugins.py)

Backup original version of the `/usr/lib/python3/dist-packages/middlewared/plugins/reporting/plugins.py`,
replace it with one that supports NUT monitoring and restart middlewared:

```sh
systemctl restart middlewared
```

If everything was done correctly, and with some luck, you should see
NUT graphs at the reporting UPS page


