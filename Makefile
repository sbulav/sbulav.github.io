.PHONY: help install serve build preview clean clean-branches calico-policy
.DEFAULT: help

VISUALISER_DIR ?= $(HOME)/git_hh/calico-policy-visualiser

help:
	@echo "Astro Blog Development Environment"
	@echo "make <target> where <target>:"
	@echo ""
	@echo "  install        Install npm dependencies"
	@echo "  serve          Start Astro dev server (http://localhost:4321)"
	@echo "  build          Build the site for production"
	@echo "  preview        Preview production build locally"
	@echo "  clean          Remove dist/ and node_modules/.cache"
	@echo "  clean-branches Remove all merged git branches"
	@echo "  calico-policy  Build Calico Visualiser and copy into ./calico-visualiser"
	@echo ""
	@echo "  Note: Run 'nix develop' first to enter the development shell"

install:
	npm install

serve:
	npm run dev

build:
	npm run build

preview:
	npm run preview

clean:
	rm -rf dist/ node_modules/.cache

clean-branches:
	git branch --merged | egrep -v "(^\*|master|dev|main)" | xargs git branch -d 2>/dev/null || true

calico-policy: ## Build Calico Visualiser and copy into ./calico-visualiser
	cd $(VISUALISER_DIR) && npx vite build --base=/calico-visualiser/
	rm -rf calico-visualiser
	cp -r $(VISUALISER_DIR)/dist calico-visualiser
	@echo "Calico Visualiser built and copied to ./calico-visualiser"
