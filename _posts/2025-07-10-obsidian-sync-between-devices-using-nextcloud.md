---

title: "Obsidian Sync Between Devices Using Nextcloud"
date: 2025-07-10
categories:
- obsidian
- nextcloud
tags:
- obsidian
- nextcloud
comments: true

---

I've been using Obsidian for managing notes across multiple devices for a while
now. Initially, I relied on remote sync via Yandex Disk, mostly because it was
convenient and free. However, recently I've encountered significant issues with
it, primarily due to frequent HTTP 429 "Too Many Requests" errors, effectively
rendering the sync unusable. It turns out I'm not alone—it's a widespread
problem, as highlighted in [this GitHub issue](https://github.com/remotely-save/remotely-save/issues/1026).

Given these persistent connectivity problems, I decided it was time to switch
to a more reliable alternative: Nextcloud. Fortunately, I've been self-hosting
Nextcloud for some time, and it conveniently provides WebDAV support right out
of the box.

In this post, I'll describe the straightforward steps for setting up Obsidian
synchronization using Nextcloud's WebDAV integration.

## Setting Up Obsidian Sync with Nextcloud

### 1. Create a dedicated Nextcloud user

First, create a dedicated user on Nextcloud specifically for Obsidian to manage
permissions and keep data organized. I named mine `obsidian`.

### 2. Configure Obsidian Remote Sync

In Obsidian, install and enable the Remote Sync plugin. Set the server address
to your Nextcloud WebDAV URL, structured as follows:

```
https://nextcloud.yourdomain.com/remote.php/dav/files/obsidian
```

Replace `nextcloud.yourdomain.com` with your actual Nextcloud domain.

### 3. Input Nextcloud Credentials

Enter the username and password for your dedicated Nextcloud `obsidian` user
into the Remote Sync settings.

### 4. Verify Connection

Use the "Check Connection" button in the plugin settings to confirm that
everything is configured correctly. If set up properly, you should receive a
successful connection message.

### 5. (Optional) Share Notes with Other Users

Optionally, you can share your Obsidian notes folder within Nextcloud with your
primary user or any other users if you'd like easy direct access to your notes
through the Nextcloud interface.

### 6. Configure Mobile Sync

On your mobile devices, repeat the same steps using the Obsidian app. Ensure
you use the identical server address and credentials. Your mobile devices will
seamlessly synchronize notes through Nextcloud's WebDAV interface.

## Conclusion

After transitioning to Nextcloud for syncing Obsidian notes, all previous
connectivity issues disappeared entirely. The synchronization is now reliable
and seamless across both desktop and mobile devices. Additionally, if
preferred, you can even skip using the Obsidian mobile app entirely and view or
edit notes directly through the Nextcloud mobile app.

Overall, Nextcloud has proven to be a robust, hassle-free solution for
synchronizing Obsidian notes between devices.

