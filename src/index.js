const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const pkg = require("../package.json");

const MEMORY_THRESHOLD_MB = 512;

// GET /health
app.get("/health", (req, res) => {
  const memoryMB = process.memoryUsage().rss / 1024 / 1024;
  const status = memoryMB > MEMORY_THRESHOLD_MB ? "degraded" : "ok";

  res.json({
    status,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    version: pkg.version,
    memory: Math.round(memoryMB * 100) / 100,
  });
});

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

if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
