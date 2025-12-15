const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;

// Serve all files from the current directory as static assets.
app.use(express.static(path.join(__dirname)));

// Fallback to index.html for SPA-style routing support.
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
