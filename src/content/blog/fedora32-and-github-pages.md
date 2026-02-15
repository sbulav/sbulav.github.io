---
title: "Fedora 32 and github pages"
date: 2020-06-03


---

Last week I've updated my working machine to Fedora 32. Upgrade went smoothly
and, after a week, I thought that I wouldn't face any issues.

However, when today I tried to write a new post to my blog, following error
appeared:

```
[sab@fz sbulav.github.io] (master *%)$ make serve
bundle exec jekyll serve -H 0.0.0.0 --watch --port 8080 --livereload
bundler: failed to load command: jekyll (/usr/bin/jekyll)
LoadError: libruby.so.2.6: cannot open shared object file: No such file or directory - /usr/lib64/gems/ruby/nokogiri-1.10.9/nokogiri/nokogiri.so
...
```

The file was clearly there and all the permissions were in place. After couple hours
of investigation, following things became clear:
* Fedora 32 uses Ruby 2.7 as default
* At the time of writing, gem `nokogiri` don't fully support Ruby 2.7
* Github pages don't support Jekyll 4+

So the decision was to install Ruby 2.6 in Fedora 32 using rvm.

Here's what I've used to install Ruby 2.6 and reinstall gems:

```bash
# Install rvm
curl -sSL https://rvm.io/mpapis.asc | gpg2 --import -
curl -sSL https://rvm.io/pkuczynski.asc | gpg2 --import -
curl -L get.rvm.io | bash -s stable

# Source environment
source ~/.rvm/scripts/rvm
rvm reload

# Install Ruby 2.6
rvm requirements run
rvm list known
rvm install 2.6

# Install bundler
gem install bundler:2.1.4

# Reinstall gems for blog
bundle
```

You can check out [How To Install Ruby on Fedora 31/30 with RVM](https://tecadmin.net/install-ruby-on-fedora/)
article for more details.