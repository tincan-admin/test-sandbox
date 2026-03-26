# Contributing to test-sandbox

Thank you for your interest in contributing! This guide will help you get started.

## Getting Started

1. **Fork the repository** — Click the "Fork" button on GitHub to create your own copy.
2. **Clone your fork**:
   ```bash
   git clone https://github.com/<your-username>/test-sandbox.git
   cd test-sandbox
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```

## Development Workflow

### Creating a Branch

Create a feature branch from `main` for your changes:

```bash
git checkout -b feat/your-feature-name
```

Use a descriptive branch name that reflects the change, for example:

- `feat/add-search-endpoint`
- `fix/item-validation`
- `docs/update-readme`

### Making Changes

1. Make your changes in the `src/` directory.
2. Run the app locally to verify:
   ```bash
   npm start
   ```
3. Run the test suite to ensure nothing is broken:
   ```bash
   npm test
   ```

### Commit Messages

Use [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>(<scope>): <description>
```

Examples:

- `feat: add search endpoint for items`
- `fix: handle missing name in POST /items`
- `docs: update API endpoint documentation`
- `test: add tests for DELETE /items/:id`

Common types: `feat`, `fix`, `docs`, `test`, `refactor`, `chore`.

## Submitting a Pull Request

1. **Push your branch** to your fork:
   ```bash
   git push origin feat/your-feature-name
   ```
2. **Open a Pull Request** against the `main` branch of this repository.
3. In your PR description:
   - Summarize what the change does and why.
   - Reference any related issues (e.g., "Closes #12").
4. Wait for a review. Address any feedback by pushing additional commits to your branch.

## Code Style

- Keep code simple and readable.
- Follow the existing patterns in the codebase.
- Ensure all tests pass before submitting.

## Reporting Issues

If you find a bug or have a feature request, please open a GitHub issue with:

- A clear title and description.
- Steps to reproduce (for bugs).
- Expected vs. actual behavior.
