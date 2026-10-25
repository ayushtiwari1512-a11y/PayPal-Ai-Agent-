require("dotenv").config();
const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(express.json());

// Check whether the server is running.
app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

// Serve the built React app when its index.html exists.
const clientDist = path.join(__dirname, "..", "client", "dist");
const indexFile = path.join(clientDist, "index.html");
const hasClient = fs.existsSync(indexFile);

if (hasClient) {
  app.use(express.static(clientDist));
}

// Keep unknown API routes as JSON 404 responses.
app.use("/api", (req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Load the React app for valid page requests.
app.use((req, res, next) => {
  const isPageRequest =
    (req.method === "GET" || req.method === "HEAD") &&
    !path.extname(req.path) &&
    req.accepts("html");

  if (hasClient && isPageRequest) {
    return res.sendFile(indexFile);
  }

  next();
});

const port = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(port, () => {
    console.log(`MerchantRelay server running on http://localhost:${port}`);
  });
}

module.exports = app;