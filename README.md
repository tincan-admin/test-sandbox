# test-sandbox

A simple Express CRUD app used for Knight smoke tests.

## Hello World

A simple endpoint to verify the server is running:

```
GET /hello
```

Response:

```json
{ "message": "Hello, world!" }
```

### Example

```bash
curl http://localhost:3000/hello
```

## Endpoints

- `GET /hello` — hello-world health check
- `GET /items` — list all items
- `GET /items/:id` — get item by ID
- `POST /items` — create item (body: `{ "name": "..." }`)
- `DELETE /items/:id` — delete item

## Development

```
npm install
npm start
npm test
```
