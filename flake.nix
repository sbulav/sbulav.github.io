{
  description = "Dev env for sbulav.github.io blog (Astro + GitHub Pages)";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    {
      self,
      nixpkgs,
      flake-utils,
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
        node = pkgs.nodejs_22;
      in
      {
        devShells.default = pkgs.mkShell {
          name = "sbulav-github-io";
          buildInputs = [
            node
            pkgs.pnpm
            pkgs.gnumake
            pkgs.git
          ];

          shellHook = ''
            export LANG=en_US.UTF-8

            echo "[sbulav.github.io] Astro devshell ready."
            echo ""
            echo "  pnpm install      # Install dependencies (first run)"
            echo "  pnpm dev          # Start dev server"
            echo "  pnpm build        # Production build"
            echo "  pnpm preview      # Preview production build"
          '';
        };

        apps.dev = {
          type = "app";
          program = "${pkgs.writeShellScript "dev" ''
            set -euo pipefail
            export PATH="${node}/bin:${pkgs.pnpm}/bin:$PATH"
            echo "Installing dependencies..."
            pnpm install --frozen-lockfile 2>/dev/null || pnpm install
            echo "Starting Astro dev server..."
            pnpm dev
          ''}";
        };
      }
    );
}
