const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

// Define a proxy for your Quasar development server
const quasarDevServer = createProxyMiddleware({
  target: "http://localhost", // Replace with your Quasar server URL
  changeOrigin: true,
});

// Use the proxy middleware for all requests
app.use("/", quasarDevServer);

// Start the proxy server with HTTPS
const https = require("https");
const fs = require("fs");

const server = https.createServer(
  {
    key: fs.readFileSync("private-key.pem"), // Replace with your private key path
    cert: fs.readFileSync("public-cert.pem"), // Replace with your certificate path
  },
  app
);

const PORT = process.env.PORT || 443; // Use port 443 for HTTPS

server.listen(PORT, () => {
  console.log(`Proxy server running on https://localhost:${PORT}`);
});
