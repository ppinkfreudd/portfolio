const serverless = require('serverless-http');
const express = require('express');
const app = express();

// Add your middleware and routes here
app.use(express.json());
app.get('/', (req, res) => res.send('Server is working!'));

module.exports.handler = serverless(app);