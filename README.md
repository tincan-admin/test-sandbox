# test-sandbox

A simple Express CRUD app used for Knight smoke tests.

## Endpoints

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
