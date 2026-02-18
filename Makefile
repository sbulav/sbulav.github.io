.PHONY: help install dev dev-host build preview preview-host clean lint lint-fix format format-check copy-calico

# Default target - shows help
help:
	@echo "Available commands:"
	@echo "  make install     - Install dependencies"
	@echo "  make dev         - Start dev server (localhost only)"
	@echo "  make dev-host    - Start dev server on all hosts (for mobile development)"
	@echo "  make build       - Build for production"
	@echo "  make preview     - Preview production build"
	@echo "  make preview-host - Preview production build on all hosts"
	@echo "  make clean       - Clean build artifacts (dist/, .astro/)"
	@echo "  make lint        - Run CSS linter"
	@echo "  make lint-fix    - Fix CSS linting issues"
	@echo "  make format      - Format code with prettier"
	@echo "  make format-check - Check code formatting"
	@echo "  make copy-calico  - Copy calico-visualiser from pre-built source"

# Install dependencies
install:
	pnpm install

# Start dev server (localhost only)
dev:
	pnpm dev

# Start dev server on all hosts (for mobile development)
dev-host:
	pnpm dev --host 0.0.0.0

# Build for production
build: copy-calico
	pnpm build

# Copy calico-visualiser from pre-built source
copy-calico:
	rm -rf public/calico-visualiser
	cp -r ../calico-policy-visualiser/dist public/calico-visualiser
	sed -i 's|href="/|href="/calico-visualiser/|g; s|src="/|src="/calico-visualiser/|g' \
		public/calico-visualiser/index.html

# Preview production build
preview:
	pnpm preview

# Preview production build on all hosts
preview-host:
	pnpm preview --host 0.0.0.0

# Clean build artifacts
clean:
	rm -rf dist/ .astro/

# Run CSS linter
lint:
	stylelint "src/**/*.css"

# Fix CSS linting issues
lint-fix:
	stylelint "src/**/*.css" --fix

# Format code with prettier
format:
	prettier --write "src/**/*.{ts,astro,css}"

# Check code formatting
format-check:
	prettier --check "src/**/*.{ts,astro,css}"
