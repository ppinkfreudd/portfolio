const serverless = require('serverless-http');
const express = require('express');
const app = express();

app.use(express.json()); // Middleware to parse JSON request bodies

// Handle GET requests to the root
app.get('/.netlify/functions/server', (req, res) => {
  res.send('Server is working!');
});

// Handle POST requests for the chatbot
app.post('/.netlify/functions/server', (req, res) => {
  const { query } = req.body;

  // Validate the request body
  if (!query) {
    return res.status(400).json({ error: 'Missing "query" in request body' });
  }

  // Example chatbot response
  const response = {
    text: `You asked: "${query}"`,
  };

  // Send the response back to the client
  res.status(200).json(response);
});

module.exports.handler = serverless(app);