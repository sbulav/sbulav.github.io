---
title: "Using fzf with kubectl as REPL"
date: 2020-06-08
last_modified_at: 2020-06-09
categories:
  - #kubernetes
tags:
  - #kubernetes
  - #til
  - #fzf
comments: true
---

I was pretty impressed by the article [fzf-live-repl](https://paweldu.dev/posts/fzf-live-repl/)
and decide to adapt these techniques in my daily work with Kubernetes.

## Using fzf as JQ repl

Command in the article above didn't work for me:
```bash
echo '' | fzf --print-query --preview 'jq {q} /path/to/json/file'
```

After some investigation, it turned out that `FZF_DEFAULT_OPTS`, which I've
described in [FZF on Fedora](https://sbulav.github.io/tools/fzf-on-fedora/#set-up-preview-in-bash)
were breaking preview. Also I wanted to be able to pass various resources and
arguments into the query. So to do this, I used following tricks:
* define function to be able to pass arguments
* use $* to pass all arguments into function
* set up local FZF environment option by using ()

I end up with following function:

```bash
kgjq() { (FZF_DEFAULT_OPTS='';kubectl get *$ -o json > /tmp/kgjq.json;echo ''  | fzf --print-query --preview 'jq {q} /tmp/kgjq.json';) }
```

Here's how it works:

![fzf-jq-repl](/assets/images/fzf-jq-repl.gif)

As you might guess, after you press `enter`, resulting jsonpath will pop in
your command line. To make function work, put it into your `.bash_profile`


## Using fzf as kubectl preview

Another cool feature I thought about was fuzzy finding kubernetes resources
with live preview and ability to edit this resource without leaving fzf
I know about [k9s](https://github.com/derailed/k9s) and [kubectl-aliases](https://github.com/ahmetb/kubectl-aliases)
but I tend to minimalism in my settings.

Again, I'll be using bash function with $* to pass all variables into it:

```bash
kg() { kubectl get $* -o name | fzf --preview 'kubectl get {} -o yaml' --bind "enter:execute(kubectl get {} -o yaml | nvim )"; }
```

It's working very well:

![fzf-kubectl-repl](/assets/images/fzf-kubectl-repl.gif)

The trick I'm using here is binding `enter` in fzf to execute `kubectl get`,
passing selected resource name as parameter, and passing output to nvim(which can
read stdin without additional keys). I will think about adding `--export` option
to kubectl or passing multiple files to nvim, or about refreshing fuzzy list without
leaving fzf, but even now I'm really enjoying it.


### Futher improvements

After a few days after writing this post I've done following improvementes to `kg` function:

```bash
kg() {
    kubectl get $* -o name | \
        fzf --preview 'kubectl get {} -o yaml' \
            --bind "ctrl-\:execute(kubectl get {+} -o yaml | nvim )" \
            --bind "ctrl-r:reload(kubectl get $* -o name)" --header 'Press CTRL-R to reload' \
            --bind "ctrl-]:execute(kubectl edit {+})";
     }
```

* Replace {} with {+} to allow editing multiple files
* Add new binding to edit `live` kubernetes resource
* Add new binding to reload preview list

So I end up using following shortcuts:
* `tab` - multi-select entry under cursor
* `ctrl-a` - select all
* `ctrl-r` - reload preview list
* `ctrl-\` - edit a local copy of selected resources in neovim
* `ctrl-]` - edit `live` version of kubernetes  resource with default editor
* `enter` - exit from fzf and print current selection
* `shift-up` - move preview window line up
* `shift-down` - move preview window line down

![fzf-kubectl-repl2](/assets/images/fzf-kubectl-repl2.gif)
