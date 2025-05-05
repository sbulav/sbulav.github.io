---
title: "Understanding ZFS-ZED Service Failures on NixOS"
date: 2025-05-06
categories:
  - nix
tags:
  - nix
  - zfs
comments: true
---

## Understanding ZFS-ZED Service Failures on NixOS

I'm running NixOS with ZFS, and couple timed during updates I've faced an issue with the
ZFS Event Daemon (`zfs-zed`) service. A typical error message looks like this:

```text
× zfs-zed.service - ZFS Event Daemon (zed)
     Loaded: loaded (/etc/systemd/system/zfs-zed.service; enabled; preset: ignored)
    Drop-In: /nix/store/...-system-units/zfs-zed.service.d
             └─overrides.conf
     Active: failed (Result: start-limit-hit)
   Duration: 31ms
    Process: ExecStart=/nix/store/.../sbin/zed -F (code=exited, status=0/SUCCESS)

systemd[1]: zfs-zed.service: Scheduled restart job, restart counter is at 5.
systemd[1]: zfs-zed.service: Start request repeated too quickly.
systemd[1]: zfs-zed.service: Failed with result 'start-limit-hit'.
systemd[1]: Failed to start ZFS Event Daemon (zed).
```

### Why Does This Happen?

When the Linux kernel updates on NixOS, the corresponding ZFS kernel modules
are also updated. These updated modules, however, won't match your currently
running kernel until you reboot your system.

On stable branches (`nixos-24.05`, `nixos-24.11`, etc.), kernel and module
updates are less frequent, minimizing this issue. On the unstable branch
(`nixos-unstable`), updates happen frequently, making mismatches between the
kernel and ZFS modules more common. This mismatch is usually the primary reason
for failures in services like `zfs-zed`.

### How to Resolve the Issue

The simplest solution is to reboot your system. A reboot ensures the newly
installed kernel and ZFS modules are properly loaded and aligned:

```bash
sudo reboot
```

After rebooting, verify the service is operational:

```bash
sudo systemctl status zfs-zed.service
```

### Preventive Measures

* **Prefer stable branches** if frequent reboots due to kernel updates are
  problematic for your workflow.
* For those on unstable branches, consider automating reboot notifications or
  planning updates during scheduled maintenance periods.
* Use [nvd](https://khumba.net/projects/nvd/) to receive package version diff
  when updating your NixOS system. It can help you determine if kernel and zfs
  packages were updated.

By understanding this behavior, you can better manage ZFS on your NixOS systems
and minimize downtime.
