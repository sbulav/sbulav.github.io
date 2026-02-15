---
title: "Using renovate to update Nix flakes"
date: 2025-05-05


---

[Renovate](https://docs.renovatebot.com/) is an essential tool for managing
dependencies automatically.  Integrating Renovate with your Nix Flake-based
project ensures timely updates, maintains security, and keeps your project
streamlined. Here's how to onboard your repository and configure Renovate
effectively.

# Step-by-Step Configuration

## Enable Renovate in GitHub:

- Navigate to the Renovate GitHub App and enable it for your repository.

- Prepare the Configuration File:

  - Create a configuration file named `renovate.json`.

  - For better repository clarity, place it within the .github folder, which
    prevents clutter by hiding this configuration at the repository root.

## My example Configuration (.github/renovate.json)

```
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": [
    "config:recommended",
    ":semanticCommitTypeAll(chore)"
  ],
  "lockFileMaintenance": {
    "enabled": true,
    "extends": [
      "schedule:weekly"
    ]
  },
  "nix": {
    "enabled": true
  },
  "ignoreDeps": [
    "stable",
    "wallpapers-nix"
  ]
}

```

## Configuration Explained

- config:recommended: This base configuration applies sensible defaults, enabling dependency updates
and grouping rules for easier management.

- :semanticCommitTypeAll(chore): Renovate commits will consistently use chore, aiding in clear and predictable
commit histories.

- Lockfile Maintenance: Weekly lockfile updates ensure dependencies stay fresh without overwhelming maintainers.

- Nix-Specific Configuration: Explicitly enabling Nix support ensures Renovate correctly manages Nix Flake dependencies.

- Ignoring Problematic Dependencies: Ignoring specific dependencies (for me it was stable) avoids known Renovate
issues. Renovate incorrectly attempts to update stable to version tags like
v208, causing update failures such as: `WARN: Error updating branch: update failure (branch="renovate/stable-208.x")`

Explicitly listing these dependencies in ignoreDeps circumvents this problem.
Furthermore, I only want to bump stable inputs, for example from 24.05 to 24.11
when I'm ready to upgrade my system.

If you want to do so, you can use renovate [packagerules](https://docs.renovatebot.com/configuration-options/#packagerules)
to carefully filter your updates.



# Conclusion

By using Renovate with a carefully tuned configuration, you benefit from
automated dependency management tailored specifically to Nix Flakes. This
approach improves project maintainability, reduces manual overhead, and helps
prevent dependency-related security issues.