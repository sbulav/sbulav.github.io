{
  description = "Dev env for sbulav.github.io blog (Jekyll + GitHub Pages)";

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
        ruby = pkgs.ruby_3_3;
      in
      {
        devShells.default = pkgs.mkShell {
          name = "sbulav-github-io";
          buildInputs = [
            ruby
            node
            pkgs.gnumake
            pkgs.git

            # Native dependencies for gem compilation
            pkgs.pkg-config
            pkgs.libxml2
            pkgs.libxslt
            pkgs.zlib
            pkgs.openssl
            pkgs.libffi
            pkgs.libyaml
          ];

          shellHook = ''
            export LANG=en_US.UTF-8
            export BUNDLE_PATH=vendor/bundle

            # Build nokogiri against system libraries instead of vendored ones
            export NOKOGIRI_USE_SYSTEM_LIBRARIES=1

            # Create .bundle/config if it doesn't exist
            if [ ! -f .bundle/config ]; then
              mkdir -p .bundle
              echo '---' > .bundle/config
              echo 'BUNDLE_PATH: "vendor/bundle"' >> .bundle/config
            fi

            echo "[sbulav.github.io] devshell ready."
            echo ""
            echo "  bundle install    # Install Jekyll and dependencies (first run)"
            echo "  make serve        # Serve site locally on http://0.0.0.0:8080"
            echo "  make help         # Show all targets"
          '';
        };

        apps.serve = {
          type = "app";
          program = "${pkgs.writeShellScript "serve" ''
            set -euo pipefail
            export PATH="${ruby}/bin:$PATH"
            export BUNDLE_PATH=vendor/bundle
            export NOKOGIRI_USE_SYSTEM_LIBRARIES=1
            echo "Installing dependencies..."
            bundle install --quiet
            echo "Starting Jekyll server..."
            bundle exec jekyll serve -H 0.0.0.0 --watch --port 8080
          ''}";
        };
      }
    );
}
