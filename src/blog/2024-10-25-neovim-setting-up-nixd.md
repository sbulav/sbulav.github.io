---
title: "Switching from nil to nixd Language Server for Better Nix Development Experience"
date: 2024-10-25
categories:
  - vim
tags:
  - vim
comments: true
---

I was using [nil language server](https://github.com/oxalica/nil) for a while, and
it was working fine.

However, after a great video from [vimjoyer's new
video](https://www.youtube.com/watch?v=M_zMoHlbZBY) nixd seems to have more
features, as it is in very active development state right now.

Among the killer features for me was options auto-completion.

While vimjoyer did a great job, setting up nixd auto-completion wasn't a
straightforward process for me.  It this blog post, I'll share my experience in
setting it up.

## Installing nixd

If you're using flakes, installing is as easy as following code and rebuinding
your system:

```nix
{ pkgs, ... }: {
  environment.systemPackages = with pkgs; [
    nixd
  ];
}
```

For other options, check out [nixd installation guide](https://github.com/nix-community/nixd/blob/main/nixd/docs/editor-setup.md#installation---get-a-working-executable)

## Figure out correct paths and system name in Nix repl

```nix
nix-repl> builtins.getFlake "/Users/sab/dotfiles/nix"
{
  _type = "flake";
  checks = { ... };
  darwinConfigurations = { ... };
  darwinModules = { ... };
  devShells = { ... };
  homeConfigurations = { ... };
  homeModules = { ... };
  ...
}

I'm using flakes, and my Nix flake is not 'pure', i.e. not in the git root, following
configuration worked:

```nix
nix-repl> import (builtins.getFlake(toString ./.)).inputs.nixpkgs { }
{
  AAAAAASomeThingsFailToEvaluate = «error: Please be informed that this pseudo-package is not the only part
of Nixpkgs that fails to evaluate. You should not evaluate
entire Nixpkgs without some special measures to handle failing
packages, like using pkgs/top-level/release-attrpaths-superset.nix.
»;
...
```

Finally, figure out correct system name and username for nixosConfigurations,
darwinConfigurations(if you're using one) and homeConfigurations:

```nix
sab@mbp16 ~> cd ~/dotfiles/nix/

# Starting nix repl
sab@mbp16 ~/d/nix (dev|✔)> nix repl
Nix 2.24.8
Type :? for help.
Loading installable 'git+file:///Users/sab/dotfiles?dir=nix#'...
Added 15 variables.

# Loading flake
nix-repl> :lf .
Added 27 variables.

# Checking outputs for correct name

nix-repl> outputs.darwinConfigurations.mbp16.options
{
  _module = { ... };
  assertions = { ... };
  ...
}

nix-repl> outputs.homeConfigurations."sab@nz".options
  _module = { ... };
  accounts = { ... };
  assertions = { ... };
  custom = { ... };
  ...
}
```

Use <TAB> auto-completion to figure out required parameters.

## Configuring nixd in Neovim

I'm using following configuration to set up to enable and configure language server via
[nvim-lspconfig](https://github.com/neovim/nvim-lspconfig/blob/master/doc/configs.md#nixd):

```lua
require("lspconfig").nixd.setup {
    cmd = { "nixd" },
    settings = {
        nixd = {
            nixpkgs = {
                -- For flake.
                -- This expression will be interpreted as "nixpkgs" toplevel
                -- Nixd provides package, lib completion/information from it.
                -- Resource Usage: Entries are lazily evaluated, entire nixpkgs takes 200~300MB for just "names".
                -- Package documentation, versions, are evaluated by-need.
                expr = "import (builtins.getFlake(toString ./.)).inputs.nixpkgs { }",
            },
            formatting = {
                command = { "alejandra" }, -- or nixfmt or nixpkgs-fmt
            },
            options = {
                nixos = {
                    expr = "let flake = builtins.getFlake(toString ./.); in flake.nixosConfigurations.nz.options",
                },
                home_manager = {
                    expr = 'let flake = builtins.getFlake(toString ./.); in flake.homeConfigurations."sab@mbp16".options',
                },
                darwin = {
                    expr = "let flake = builtins.getFlake(toString ./.); in flake.darwinConfigurations.mbp16.options",
                },
            },
        },
    },
},
```

Check out for
[configuration-overview](https://github.com/nix-community/nixd/blob/main/nixd/docs/configuration.md#configuration-overview)
for more details.

Using this config, I'm:

- using alejandra for formatting
- using options from "nz" host for nixos options completion
- using options from "mbp16" host for darwin options completion
- using options from "sab@mbp16" user/host for homeManager options completion

Example completion:

<img width="925" alt="Screenshot 2024-10-25 at 09 53 25" src="https://github.com/user-attachments/assets/146ed0cd-23b7-4fd8-bcc9-e7dad33660a5">

