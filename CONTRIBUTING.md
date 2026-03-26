# Contributing to test-sandbox

Thanks for your interest in contributing! This guide will help you get started.

## Getting Started

1. Fork the repository and clone your fork.
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm start
   ```

## Making Changes

1. Create a new branch from `main` for your work:
   ```
   git checkout -b feat/your-feature
   ```
2. Make your changes in the `src/` directory.
3. Follow the existing code style (Express routes, in-memory data store).
4. Keep changes focused — one feature or fix per pull request.

## Running Tests

Run the test suite before submitting your changes:

```
npm test
```

All tests use Node.js built-in test runner (`node:test`). Make sure all existing tests pass and add tests for any new functionality.

## Commit Messages

Use [Conventional Commits](https://www.conventionalcommits.org/) format:

```
feat: add new endpoint for updating items
fix: handle missing request body gracefully
docs: update API endpoint documentation
test: add tests for DELETE endpoint
```

## Submitting a Pull Request

1. Push your branch to your fork.
2. Open a pull request against `main`.
3. Provide a clear description of your changes.
4. Ensure all tests pass.

## Reporting Issues

If you find a bug or have a feature request, please open an issue with a clear description and steps to reproduce (if applicable).

## Code of Conduct

Be respectful and constructive in all interactions. We are committed to providing a welcoming and inclusive experience for everyone.
