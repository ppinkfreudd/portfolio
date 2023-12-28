const express = require('express')
const { generateAnswer } = require('./controllers/openaiController');

// Setting up app
const app = express()

// Middleware to extract json data from POST requests
app.use(express.json())
app.use(express.static('public'))

// Create route for handling POST requests to '/openai/response'
app.post('/openai/response', generateAnswer)


// Listen on port 4000
app.listen(4000, () => console.log('Listening for requests on port 4000'))
