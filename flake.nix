{
  description = "Dev env for sbulav.github.io blog (Astro)";

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
      in
      {
        devShells.default = pkgs.mkShell {
          name = "sbulav-github-io";

          packages = with pkgs; [
            nodejs_22
            git
            bun
            just
            starship
          ];

          shellHook = ''
            export LANG=en_US.UTF-8

            # npm aliases
            alias dev="npm run dev"
            alias build="npm run build"
            alias preview="npm run preview"
            alias clean="rm -rf dist/ node_modules/.cache"

            echo "══════════════════════════════════════════════════════"
            echo "  ~/sbulav git:(astro)"
            echo "══════════════════════════════════════════════════════"
            echo ""
            echo "  Available commands:"
            echo "    dev        - Start dev server (http://localhost:4321)"
            echo "    build      - Build for production"
            echo "    preview    - Preview production build"
            echo "    clean      - Clean dist and cache"
            echo ""
            echo "  Keyboard shortcuts in browser:"
            echo "    [P]osts  [C]ategories  [T]ags  [A]bout"
            echo "    :help     - Command palette help"
            echo ""
          '';
        };

        apps.serve = {
          type = "app";
          program = (
            pkgs.writeShellScriptBin "serve" ''
              set -euo pipefail
              exec npm run dev
            ''
          );
        };

        apps.build = {
          type = "app";
          program = (
            pkgs.writeShellScriptBin "build" ''
              set -euo pipefail
              exec npm run build
            ''
          );
        };
      }
    );
}
