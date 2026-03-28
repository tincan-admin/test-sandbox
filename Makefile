.PHONY: build test lint clean install

# Install dependencies
install:
	npm install

# Build (install dependencies for this Node project)
build: install

# Run tests using Node's built-in test runner
test:
	npm test

# Lint source files (using Node --check for syntax validation)
lint:
	node --check src/**/*.js

# Remove generated artifacts
clean:
	rm -rf node_modules
