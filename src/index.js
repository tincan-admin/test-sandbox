const express = require("express");
const validate = require("./middleware/validate");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Schema for POST /users
const createUserSchema = {
  name: { type: "string", required: true, minLength: 1, maxLength: 100 },
  email: { type: "string", required: true, pattern: /@/ },
};

// In-memory store
const items = [];
let nextId = 1;

// GET /items
app.get("/items", (req, res) => {
  res.json(items);
});

// GET /items/:id
app.get("/items/:id", (req, res) => {
  const item = items.find((i) => i.id === parseInt(req.params.id));
  if (!item) return res.status(404).json({ error: "Not found" });
  res.json(item);
});

// POST /items
app.post("/items", (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Name is required" });
  const item = { id: nextId++, name };
  items.push(item);
  res.status(201).json(item);
});

// DELETE /items/:id
app.delete("/items/:id", (req, res) => {
  const index = items.findIndex((i) => i.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: "Not found" });
  items.splice(index, 1);
  res.status(204).send();
});

// In-memory users store
const users = [];
let nextUserId = 1;

// POST /users
app.post("/users", validate(createUserSchema), (req, res) => {
  const { name, email } = req.body;
  const user = { id: nextUserId++, name, email };
  users.push(user);
  res.status(201).json(user);
});

if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
