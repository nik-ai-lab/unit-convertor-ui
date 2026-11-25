# ──────────────────────────────────────────────
# Unit Converter UI – Makefile
# ──────────────────────────────────────────────
SHELL       := /bin/bash
APP_NAME    := unit-converter-ui
VERSION     := $(shell cat version 2>/dev/null || echo "0.0.0")
IMAGE_NAME  ?= ghcr.io/$(APP_NAME)
IMAGE_TAG   ?= $(VERSION)

.PHONY: all install lint test build package clean \
        docker-build docker-push docker-up docker-down help

## Default target
all: install lint test build

## ── Dependencies ────────────────────────────
install:                           ## Install npm dependencies
	npm install
## ── Dependencies ────────────────────────────
install-ci:                           ## Install npm dependencies
	npm ci

## ── Quality ─────────────────────────────────
lint:                              ## Run linter (syntax check)
	npm run lint

test:                              ## Run unit tests
	@if [ -d tests ] && ls tests/*.test.* 1>/dev/null 2>&1; then \
	  npm test; \
	else \
	  echo "No test directory found – skipping tests"; \
	fi

## ── Build ───────────────────────────────────
build:                             ## Build the Vite/Svelte production bundle
	npm run build

package: build                     ## Alias for build (CI artifact stage)

## ── Docker ──────────────────────────────────
docker-build:                      ## Build Docker image
	docker build -t $(IMAGE_NAME):$(IMAGE_TAG) .

docker-push: docker-build          ## Push Docker image
	docker push $(IMAGE_NAME):$(IMAGE_TAG)

docker-up:                         ## Start services via docker compose
	docker compose up -d

docker-down:                       ## Stop services via docker compose
	docker compose down

## ── Housekeeping ────────────────────────────
clean:                             ## Remove build artifacts
	rm -rf dist node_modules

## ── Help ────────────────────────────────────
help:                              ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
	  awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-18s\033[0m %s\n", $$1, $$2}'
