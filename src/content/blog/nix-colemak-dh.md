---
title: "Nix Colemak-DH layout"
date: 2023-09-29


---

[NixOs](https://nixos.org/) is gaining a lot of attentions right now.
I've also decided to try to use is as my daily driver. I won't go into
the details of installation of nixos, or setting up flake. Check out
[Introduction to Nix & NixOS](https://nixos-and-flakes.thiscute.world/introduction/)
free ebook and [Nix starter configis](https://github.com/Misterio77/nix-starter-configs)

As I use [Colemak Mod-DH](https://colemakmods.github.io/mod-dh/) layout, this
was must-have first step for me to configure.

Obviously, [DreymaR's Big Bag of Keyboard
Tricks](https://github.com/DreymaR/BigBagKbdTrixXKB] didn't work on NixOS, and
I couldn't find an existing solution for this.

So I've created a custom layout based on the [DreymaR's Big Bag of Keyboard
Tricks](https://github.com/DreymaR/BigBagKbdTrixXKB].


* Create layout file `symbols/colemak_dh` with the DH symbols:

```text
default partial alphanumeric_keys

// overwrite some keys with the Mod-DH config
xkb_symbols "dh" {
	// get the base colemak layout
	include "us(colemak)"
	// use AltGr as a 3rd modifier
//include "level3(ralt_switch)"
//AB lowest row, see https://www.charvolant.org/doug/xkb/html/node5.html
//12345678
//zxcdvkh,
    key <AB01> { [             z,             Z,               U0292,               U01B7 ] }; // QWE Z Cmk zZ ʒƷ
    key <AB02> { [             x,             X,              dagger,        doubledagger ] }; // QWE X Cmk xX †‡
    key <AB03> { [             c,             C,           copyright,                cent ] }; // QWE C Cmk cC ©¢
    key <AB04> { [             d,             D,                 eth,                 ETH ] }; // QWE/Cmk V
    key <AB05> { [             v,             V,            division,         Greek_gamma ] }; // QWE/Cmk B
    key <AB06> { [             k,             K,            ccedilla,            Ccedilla ] }; // QWE N Cmk kK çÇ
    key <AB07> { [             h,             H,             hstroke,             Hstroke ] }; // QWE/Cmk M
    key <AC05> { [             g,             G,                 eng,                 ENG ] }; // QWE G Cmk D
    key <AC06> { [             m,             M,            multiply,           downarrow ] }; // QWE/Cmk H
    key <AD05> { [             b,             B,  enfilledcircbullet,          Greek_beta ] }; // QWE T Cmk G
    key <CAPS> { [    Escape,    Escape,       Escape,        Escape ] };
};
```

* Define extra custom layouts that will be included in the xkb configuration:

```nix
services.xserver.extraLayouts.dh = {
  description = "Colemak-DH ergo";
  languages = ["eng"];
  symbolsFile = ../symbols/colemak_dh;
};
```

* Define keyboard layout for xserver:

```nix
services.xserver = {
  layout = "dh,ru";
  xkbOptions = "terminate:ctrl_alt_bksp";
};
```

*  Configure layouts for your Display Server(I am using Hyprland):

```nix
# For all categories, see https://wiki.hyprland.org/Configuring/Variables/
input {
    kb_layout = dh,ru
    kb_options = caps:none,grp:win_space_toggle,caps:escape
}
```

* Finally, configure icons and switch in your bar(I am using Waybar):

```nix
"hyprland/language" = {
  "format-en" = "  dh";
  "format-ru" = "  ru";
  "keyboard-name" = "at-translated-set-2-keyboard";
  on-click = "${hyprctl} switchxkblayout at-translated-set-2-keyboard next";
};
```

I also tried setting up 3 layouts, but switching between them seems to be broken.
Anyway, this short steps could help you in setting Colemak-DH or any other custom
layout in NixOS.