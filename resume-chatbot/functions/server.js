import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import { OpenAI } from '@langchain/openai';
import { RetrievalQAChain } from 'langchain/chains';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import cors from 'cors';
import serverless from 'serverless-http';
import path from 'path';
import fs from 'fs';
import 'web-streams-polyfill/ponyfill';

const app = express();

// Configure CORS with more restrictive settings
const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// Custom prompt for QA chain
const CUSTOM_PROMPT = `
You are an AI assistant specialized in providing information about Rishit Das's professional background.

Guidelines:
- Use only the provided context to answer questions
- Keep responses concise (under 200 words)
- If the answer is not in the context, say "I don't have that information"
- If the question is unrelated to Rishit Das, explain that you can only discuss his professional profile

Context: {context}
Question: {question}

Provide a clear, informative response.
`;

// Initialize OpenAI model with error handling
const initializeModel = () => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key is not set');
    }
    return new OpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      configuration: {
        temperature: 0.3, // Lower temperature for more focused responses
      }
    });
  } catch (error) {
    console.error('Failed to initialize OpenAI model:', error);
    return null;
  }
};

// Setup function with robust error handling
async function setupQAChain() {
  try {
    const model = initializeModel();
    if (!model) {
      throw new Error('OpenAI model could not be initialized');
    }

    // Determine resume path with fallback
    const resumePath = path.resolve(
      process.env.RESUME_PATH || 
      path.join(__dirname, './Resume_Das_2024.pdf')
    );

    // Validate resume file exists
    if (!fs.existsSync(resumePath)) {
      console.error(`Resume PDF not found at: ${resumePath}`);
      return null;
    }

    // Load PDF documents
    const loader = new PDFLoader(resumePath);
    const docs = await loader.load();

    // Create vector store using MemoryVectorStore
    const embeddings = new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY });
    const vectorStore = await MemoryVectorStore.fromDocuments(docs, embeddings);

    // Create QA chain with custom prompt
    const chain = RetrievalQAChain.fromLLM(
      model, 
      vectorStore.asRetriever(),
      {
        returnSourceDocuments: true,
        inputKey: 'query',
      }
    );

    return chain;
  } catch (error) {
    console.error('Complete QA chain setup failed:', error);
    return null;
  }
}

// Global QA Chain variable
let qaChain = null;

// Route for health check
app.get('/.netlify/functions/server', (req, res) => {
  res.json({ 
    status: 'running', 
    qaChainInitialized: !!qaChain 
  });
});

// Chat endpoint
app.post('/.netlify/functions/server/chat', async (req, res) => {
  try {
    // Ensure QA chain is initialized
    if (!qaChain) {
      // Attempt to reinitialize if not already done
      qaChain = await setupQAChain();
      
      if (!qaChain) {
        return res.status(500).json({ 
          error: 'QA chain could not be initialized' 
        });
      }
    }

    const { query } = req.body;

    // Validate query
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ 
        error: 'Invalid query provided' 
      });
    }

    // Generate response
    const response = await qaChain.call({ query });

    res.json({ 
      response: response.text || 'No response generated',
      sources: response.sourceDocuments || []
    });

  } catch (error) {
    console.error('Chat endpoint error:', error);
    res.status(500).json({ 
      error: 'Failed to process chat request', 
      details: error.message 
    });
  }
});

// Initial setup
setupQAChain()
  .then((chain) => {
    qaChain = chain;
    console.log('QA Chain Initialization: ' + (chain ? 'Successful' : 'Failed'));
  })
  .catch(console.error);

// Export serverless handler
export const handler = serverless(app);