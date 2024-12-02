import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import { OpenAI } from '@langchain/openai';
import { RetrievalQAChain } from 'langchain/chains';
import { HNSWLib } from '@langchain/community/vectorstores/hnswlib';
import { OpenAIEmbeddings } from '@langchain/openai';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import cors from 'cors';
import serverless from 'serverless-http';
import path from 'path';
import fs from 'fs';

const app = express();

// Configure CORS to allow requests from any origin
const corsOptions = {
  origin: '*', // Allow all origins
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
  credentials: true, // Allow credentials
  optionSuccessStatus: 200
};

app.use(cors(corsOptions)); // Use this after the variable declaration
app.use(bodyParser.json());

// Initialize OpenAI
const model = new OpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
});

// Async function to set up resources
async function setup() {
  const resumePath = path.resolve(__dirname, 'Resume_Das_2024.pdf');

  // Check if the resume PDF exists
  if (!fs.existsSync(resumePath)) {
    console.warn(`Resume PDF not found at path: ${resumePath}. Please ensure the file is present.`);
    return null;
  }

  // Load and process the resume PDF
  const loader = new PDFLoader(resumePath);
  const docs = await loader.load();

  // Create vector store
  const vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings());

  // Create QA chain
  const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever());

  return chain;
}

// Create a variable to hold the chain
let qaChain;

// Initialize resources
setup()
  .then((chain) => {
    if (chain) {
      qaChain = chain;
      console.log('QA chain initialized');
    } else {
      console.error('QA chain could not be initialized due to missing resume PDF.');
    }
  })
  .catch((err) => {
    console.error('Failed to initialize QA chain:', err);
  });

app.post('/chat', async (req, res) => {
  const userQuery = req.body.query;

  if (!qaChain) {
    return res.status(500).json({ error: 'QA chain not initialized' });
  }

  try {
    // Generate a response using the QA chain
    const response = await qaChain.call({
      query: userQuery,
    });

    res.json({ response: response.text });
  } catch (error) {
    console.error('Error generating response:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

// Export the serverless handler
module.exports.handler = serverless(app);