#!/usr/bin/env node
import path from "path";
import express from "express";
import { readFileSync } from "fs";
import { Config } from "../config";
import { fileURLToPath } from "url";

function startServer() {
  // Load pagets-config.json
  const config = JSON.parse(
    readFileSync("./pagets-config.json", "utf-8")
  ) as Config;
  // Get __dirname equivalent in ES modules
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const app = express();
  const port = 3000;

  // Serve static files from the 'public' folder
  app.use(express.static(config.publicDir));

  // Optional: Serve index.html for the root route
  app.get("/", (req, res) => {
    res.sendFile(path.join(config.publicDir, "index.html"));
  });

  // Start the server
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

startServer();
