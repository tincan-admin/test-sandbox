# test-sandbox

A simple Express CRUD application used for Knight smoke tests. It provides a lightweight REST API for managing items, backed by an in-memory store.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express 4
- **Testing**: Node.js built-in test runner (`node:test`)

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended for the built-in test runner)
- npm

## Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd test-sandbox
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Project

Start the server:

```bash
npm start
```

The server runs on **port 3000** by default. Set the `PORT` environment variable to use a different port:

```bash
PORT=8080 npm start
```

## API Endpoints

| Method   | Path          | Description                                      |
|----------|---------------|--------------------------------------------------|
| `GET`    | `/items`      | List all items                                   |
| `GET`    | `/items/:id`  | Get an item by ID (404 if not found)             |
| `POST`   | `/items`      | Create an item (body: `{ "name": "..." }`)       |
| `DELETE`  | `/items/:id`  | Delete an item by ID (404 if not found)          |

### Example

```bash
# Create an item
curl -X POST http://localhost:3000/items \
  -H "Content-Type: application/json" \
  -d '{"name": "my-item"}'

# List all items
curl http://localhost:3000/items
```

## Running Tests

```bash
npm test
```

This runs all test files matching `src/**/*.test.js` using the Node.js built-in test runner.
