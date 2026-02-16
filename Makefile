.PHONY: help install dev dev-host build preview preview-host clean

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
build:
	pnpm build

# Preview production build
preview:
	pnpm preview

# Preview production build on all hosts
preview-host:
	pnpm preview --host 0.0.0.0

# Clean build artifacts
clean:
	rm -rf dist/ .astro/
