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

// Configure CORS
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// Handle GET requests to the root
app.get('/.netlify/functions/server', (req, res) => {
  res.send('Server is working!');
});

// Initialize OpenAI
const model = new OpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
});

// Async function to set up resources
async function setup() {
  const resumePath = path.join(__dirname, 'Resume_Das_2024.pdf');

  if (!fs.existsSync(resumePath)) {
    console.warn(`Resume PDF not found at path: ${resumePath}. Please ensure the file is present.`);
    return null;
  }

  const loader = new PDFLoader(resumePath);
  const docs = await loader.load();

  const vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings());

  const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever());

  return chain;
}

let qaChain;

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

app.post('/.netlify/functions/server/chat', async (req, res) => {
  const userQuery = req.body.query;

  if (!qaChain) {
    console.error('QA chain is not initialized');
    return res.status(500).json({ error: 'QA chain not initialized' });
  }

  try {
    const response = await qaChain.call({ query: userQuery });
    console.log('QA chain response:', response);

    res.json({ response: response.text });
  } catch (error) {
    console.error('Error generating response:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

module.exports.handler = serverless(app);