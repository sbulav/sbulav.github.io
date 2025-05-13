---
title: "(Re)Packaging Linux/Mac Kontur Talk Application with Nix"
date: 2025-05-13
categories:
  - nix
tags:
  - nix
comments: true
---

Our company recently decided to transition from Zoom to Kontur Talk (ktalk) for
voice and video communications. Kontur provides official application packages
as Linux AppImage and macOS DMG files, but to ensure consistency across
developer workstations running both Linux and macOS, I set out to create
unified packaging using Nix. Surprisingly, at the time of writing, no existing
Nix derivation for ktalk was available, motivating this packaging initiative.

## Packaging for Linux

### Step 1: Defining Source AppImage via fetchurl

To begin, we first define the source AppImage from Kontur’s official servers.
Using Nix’s built-in fetchurl utility simplifies fetching the binary while
ensuring reproducibility through a verified hash.

```nix
src = builtins.fetchurl {
  url = "https://st.ktalk.host/ktalk-app/linux/${pname}${version}x86_64.AppImage";
  sha256 = "0sb7n49kv0kwjby7sbp959jg0hhb6k0dygz7i2wv5rh58q01cy2a";
};
```

### Step 2: Using pkgs.appimageTools.wrapType2

We then utilize pkgs.appimageTools.wrapType2, a convenient NixOS helper to
automate extraction and wrapping of AppImages, enabling the binary to integrate
seamlessly with the system.

```nix
pkgs.appimageTools.wrapType2 rec {
  inherit pname version src desktopItem;

  extraInstallCommands = ''
    source "${pkgs.makeWrapper}/nix-support/setup-hook"

    wrapProgram $out/bin/${pname} \
      --run "setsid $out/bin/.${pname}-wrapped \"$@\" >/dev/null 2>&1 </dev/null &" \
      --run "exit 0"

    mkdir -p $out/share/applications/
    cp ${desktopItem}/share/applications/*.desktop $out/share/applications/
    cp -r ${appimageContents}/usr/share/icons/ $out/share/icons/

    runHook postInstall
  '';
}
```

### Step 3: Creating a Wrapper to Run the App in the Background

To prevent terminal clutter and allow seamless background operation, I created
a wrapper script that invokes the actual ktalk binary in a detached session
(setsid), ensuring a smooth user experience.

### Step 4: Making the Application Easily Launchable with Rofi

By generating a desktop item using makeDesktopItem, ktalk appears in
application launchers like Rofi, further enhancing ease of use.

```nix
desktopItem = pkgs.makeDesktopItem {
  name = "ktalk";
  desktopName = "ktalk";
  comment = "Kontur.Talk";
  icon = "ktalk";
  exec = "ktalk %U";
  categories = ["VideoConference"];
  mimeTypes = ["x-scheme-handler/ktalk"];
};
```

## Packaging for macOS

The macOS packaging posed an interesting challenge:

### Step 1: Handling Cyrillic Name in DMG

The original DMG from Kontur uses the Cyrillic name "Толк", causing issues with
the standard undmg extraction tool. It renamed 'Толк.app' into '">;:.app',
resulting in being unable in install it.

### Step 2: Using hdiutil to Unpack the Archive

Instead, I utilized the native hdiutil utility to properly mount and extract
the DMG during the unpackPhase.

```nix
unpackPhase = ''
  tmp=$(mktemp -d)
  /usr/bin/hdiutil attach "${src}" -mountpoint "$tmp" -nobrowse -quiet
  cp -R "$tmp"/* ./

  /usr/bin/hdiutil detach "$tmp" -quiet
  rm -rf "$tmp"
'';
```

### Step 3: Simplifying installPhase

After extracting the DMG correctly, the installation simply involves copying
the Contents directory to the designated location:

```nix
installPhase = ''
  mkdir -p $out/Applications/Толк.app
  cp -R "Contents" $out/Applications/Толк.app/
'';
```

## Defining Meta for Both Systems

To complete our derivation, we defined consistent metadata across both Linux
and macOS:

```nix
meta = with lib; {
  description = ''Kontur talk, communication platform'';
  longDescription = ''
    A space for communication and teamwork.

    Combines hangouts, chat rooms, webinars, online whiteboards, and a
    dedicated application for meeting rooms. Allows capturing and saving
    communication outcomes.
  '';
  homepage = "https://kontur.ru/talk";
  license = licenses.unfree;
  maintainers = with maintainers; [sbulav];
  platforms = ["x86_64-linux" "x86_64-darwin" "aarch64-darwin"];
};
```

## Full Module Code

Here's the complete Nix derivation integrating both platforms:

```nix
{
  pkgs,
  lib,
  ...
}: let
  pname = "ktalk";
  version = "3.0.0";

  # Platform-specific sources
  src =
    if pkgs.stdenv.isLinux
    then
      builtins.fetchurl {
        url = "https://st.ktalk.host/ktalk-app/linux/${pname}${version}x86_64.AppImage";
        sha256 = "0sb7n49kv0kwjby7sbp959jg0hhb6k0dygz7i2wv5rh58q01cy2a";
      }
    else
      builtins.fetchurl {
        url = "https://st.ktalk.host/ktalk-app/mac/ktalk.${version}-mac.dmg";
        sha256 = "17dg51017byd3idmk477aqgp2b748xizj4jgw2h0xdw33bz5pvl7";
      };

  meta = with lib; {
    description = ''
      Kontur talk, communication platform
    '';
    longDescription = ''
      A space for communication and teamwork

      It combines hangouts, chat rooms, webinars, online whiteboards and an
      application for meeting rooms. Allows you to capture and save the result of
      communications.
    '';
    homepage = "https://kontur.ru/talk";
    license = licenses.unfree;
    maintainers = with maintainers; [sbulav];
    platforms = ["x86_64-linux" "x86_64-darwin" "aarch64-darwin"];
  };
  # Linux-specific: Desktop item for AppImage
  desktopItem = pkgs.makeDesktopItem {
    name = "ktalk";
    desktopName = "ktalk";
    comment = "Kontur.Talk";
    icon = "ktalk";
    exec = "ktalk %U";
    categories = ["VideoConference"];
    mimeTypes = ["x-scheme-handler/ktalk"];
  };

  # Linux-specific: Extract AppImage contents
  appimageContents = pkgs.appimageTools.extractType2 {
    inherit pname version src meta;
  };
in
  if pkgs.stdenv.isLinux
  then
    pkgs.appimageTools.wrapType2 rec {
      inherit pname version src desktopItem;

      extraInstallCommands = ''
        source "${pkgs.makeWrapper}/nix-support/setup-hook"

        # Create a wrapper that runs the binary in a detached session
        wrapProgram $out/bin/${pname} \
          --run "setsid $out/bin/.${pname}-wrapped \"\$@\" >/dev/null 2>&1 </dev/null &" \
          --run "exit 0"

        mkdir -p $out/share/applications/
        cp ${desktopItem}/share/applications/*.desktop $out/share/applications/
        cp -r ${appimageContents}/usr/share/icons/ $out/share/icons/

        runHook postInstall
      '';
    }
  else
    pkgs.stdenv.mkDerivation rec {
      inherit pname version meta src;

      sourceRoot = "Толк.app"; # Matches the .dmg volume name

      unpackPhase = ''
        tmp=$(mktemp -d)
        /usr/bin/hdiutil attach "${src}" -mountpoint "$tmp" -nobrowse -quiet
        cp -R "$tmp"/* ./

        /usr/bin/hdiutil detach "$tmp" -quiet
        rm -rf "$tmp"
      '';

      installPhase = ''
        mkdir -p $out/Applications/Толк.app
        cp -R "Contents" $out/Applications/Толк.app/
      '';
    }
```

## Conclusion

Packaging Kontur Talk with Nix turned out to be simultaneously simpler and more
challenging than expected. While Linux integration was straightforward due to
excellent tooling, macOS required deeper exploration due to specific quirks.
Documentation was another pain, even finding simple function description can
be a challenge.

Overall, the outcome is a seamless, reproducible setup benefiting all our
developers.
