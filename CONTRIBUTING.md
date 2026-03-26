# Contributing to test-sandbox

Thank you for your interest in contributing! Here are some guidelines to help you get started.

## Getting Started

1. Fork the repository and clone your fork locally.
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
   git checkout -b feat/your-feature-name
   ```
2. Make your changes in the `src/` directory.
3. Follow the existing code style and conventions.
4. Keep commits focused — each commit should represent a single logical change.
5. Use conventional commit messages (e.g., `feat: add new endpoint`, `fix: handle missing name`).

## Running Tests

Before submitting your changes, make sure all tests pass:

```
npm test
```

If you're adding new functionality, please include corresponding tests in a `*.test.js` file alongside the source.

## Submitting a Pull Request

1. Push your branch to your fork.
2. Open a pull request against the `main` branch.
3. Provide a clear description of what your changes do and why.
4. Ensure all checks pass before requesting a review.

## Reporting Issues

If you find a bug or have a feature request, please open an issue with a clear description and steps to reproduce (if applicable).

## Code of Conduct

Be respectful and constructive in all interactions. We are committed to providing a welcoming and inclusive experience for everyone.
