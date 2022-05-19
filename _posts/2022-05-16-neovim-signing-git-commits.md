---
title: "Signing Git commits in NeoVim"
date: 2022-05-16
last_modified_at: 2022-05-19
categories:
  - vim
tags:
  - vim
  - git
comments: true
---

While all commits to GitHub through the web interface are automatically signed,
you have to do some configuration to make it work in the console.

Signing Git commits might be a requirement for your job, OpenSource maintainers
might only accept signed contributions or you might just want to increase the
security of your workflow.

I couldn't find any existing article on how to set up signing commits in the
NeoVim, so I'll share my findings in this post.

## Create a new GPG key and attach it to your Github account.

As the first step, you have to generate a new GPG key. This is greatly
described in the [Generating a GPG key](https://docs.github.com/en/authentication/managing-commit-signature-verification/generating-a-new-gpg-key)
article.

Make sure that you're using the correct email and that you won't forget the
password.

Once this is done, [Add a new GPG key](https://docs.github.com/en/authentication/managing-commit-signature-verification/adding-a-new-gpg-key-to-your-github-account)
as per the article.

## Configure Git to sign commits

Next step is to amend your `.gitconfig` so that every commit is signed:

```text
[user]
  ; Make sure that email matches one in the GPG key
  email = personal_email@gmail.com
  name = Sergei Bulavintsev
  ; GPG key ID
  signingkey = 7C43420F61CECAAA
[commit]
  gpgsign = true
```

Now you will be prompted to enter the GPG password when you'll try to commit
anything in the terminal. To avoid typing the password every time, it is cashed
via GPG agent.

## Configure GPG to work with NeoVim

To make NeoVim ask for your GPG password, we need to set pinentry mode to
`loopback`, as per documentation:

```text
GPGME_PINENTRY_MODE_LOOPBACK
    SINCE: 1.4.0
    Redirect Pinentry queries to the caller. This enables the use of gpgme_set_passphrase_cb because pinentry queries are redirected to gpgme.
```

To do this, edit `.gnupg/gpg-agent.conf`:

```conf
default-cache-ttl 28800
max-cache-ttl 28800
allow-loopback-pinentry
```

And `.gnupg/gpg.conf`:

```conf
use-agent
pinentry-mode loopback
```

Now reload the agent:

```bash
gpgconf --reload gpg-agent
```

If you've configured everything correctly, you'll see `Enter passphrase`
in the NeoVim:

<img width="1055" alt="Screenshot 2022-05-16 at 14 55 19" src="https://user-images.githubusercontent.com/28604639/168592427-fd315633-169c-4ddd-a3e1-e5ae41898733.png">


This approach works with any Git plugin, such as Fugitive or LazyGit. By using
cache with TTL 28800, the password has to be entered only once per day.

To check that your commit has been signed correctly:

```bash
git log --show-signature
```

You should see something like this:

<img width="1071" alt="Screenshot 2022-05-16 at 15 33 46" src="https://user-images.githubusercontent.com/28604639/168593376-07f83da6-5c50-4fec-8947-bf10c191d8e8.png">

## Trust GitHub public keys

When you use GitHub web interface, it will automatically sign your
commits using user [web-flow](https://github.com/web-flow). In the web interface,
you'll see all your commits as signed and verified. However, while
checking commits with `--show-signature` flag, web commits will not be checked:

<IMG>

To fix this, import GPG key of the user `web-flow`(kudos to [Stack Overflow](https://stackoverflow.com/a/60482908)):
```bash
$ curl https://github.com/web-flow.gpg | gpg --import
$ gpg --edit-key noreply@github.com
gpg> trust
gpg> save
$ gpg --lsign-key noreply@github.com
```

After importing the key:

<IMG>

## Signing commits for multiple emails

If you use the same GitHub account for both personal purposes(for example,
OpenSource contributions) and for work, you might want to use different
emails and GPG keys for this.

To do this:
* Generate another GPG key using your another email address
* Add new email to your GitHub Account
* Add new GPG key to your GitHub Account

Now comes the tricky part, automatically determine which GPG key to use for
signing commits.

I've found the following solution(not considering using the local `.gitconfig`
for each repository:
* Git allows to do [Conditional includes](https://git-scm.com/docs/git-config#_conditional_includes)
  in your `.gitconfig` based on the git path or origin.
* Each included file can override your `user.email` and `user.signingkey`
  settings.

For example:
```text
[user]
  ; Use this email by default
  email = personal_email@gmail.com
  name = Sergei Bulavintsev
  signingkey = 7C43420F61CECAAA
[commit]  gpgsign = true
; Override default settings if we are in the git_work folder
[includeIf "gitdir:~/git_work/"]
  path = .gitconfig-work
; Override default settings if git origin contains my username
[includeIf "hasconfig:remote.*.url:*sbulav/*"]
  path = .gitconfig-sbulav
```

And the included file `.gitconfig_work` might look like:

```text
[user]
  email = work_email@organization.com
  signingKey = A54F12F0D4D73FAA
```

For each GPG key you'll have to enter corresponding password.
