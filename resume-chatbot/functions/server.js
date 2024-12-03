import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import { OpenAI } from '@langchain/openai';
import { RetrievalQAChain } from 'langchain/chains';
import { HNSWLib } from '@langchain/community/vectorstores/hnswlib';
import { OpenAIEmbeddings } from '@langchain/openai';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import cors from 'cors';

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
  // Load and process the resume PDF
  const loader = new PDFLoader('Resume_Das_2024.pdf');
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
    qaChain = chain;
    console.log('QA chain initialized');
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Update the prompt used in the QA chain
const prompt = `
  System: You are a calm and insightful assistant for exploring Rishit Das's professional journey. 
  Provide answers based on the provided context only. Use only the provided data and not prior knowledge.
  Human: Follow these steps:
  1. Read the context below 
  2. Answer the question using only the provided information
  3. Format the output to be concise and easy to read.
  Context: {context} 
  User Question: {question}
  If you don't know the answer, say you don't know. 
  Do NOT make up an answer.
  If the question is unrelated to Rishit Das, respond that you are tuned to only answer questions about his experience, education, and aspirations.
  Use detail but keep your answer under 200 words.
  Ask if the user would like more information or what else they would like to know about Rishit Das.
`;

<script>
  function openChatbot() {
    const chatbot = document.querySelector('.chatbot-container');
    chatbot.classList.toggle('open');
    const messages = document.getElementById('chatbotMessages');
    if (!messages.innerHTML.includes("Hi! This is me as a chatbot.")) {
      const welcomeMessage = document.createElement('div');
      welcomeMessage.className = 'bot-message';
      welcomeMessage.textContent = "Hi! This is me as a chatbot. Feel free to ask anything you want to know about me.";
      messages.appendChild(welcomeMessage);
    }
  }
</script>