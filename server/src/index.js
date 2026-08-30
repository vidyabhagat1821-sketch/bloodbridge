import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { db } from './config/db.js';
import { RAGService } from './services/ragService.js';
import { errorHandler } from './middlewares/errorHandler.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import donorRoutes from './routes/donorRoutes.js';
import hospitalRoutes from './routes/hospitalRoutes.js';
import requestRoutes from './routes/requestRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import chatbotRoutes from './routes/chatbotRoutes.js';
import documentRoutes from './routes/documentRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logger
app.use((req, res, next) => {
  console.log(`📡 [${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'BloodBridge Emergency & RAG Assistance API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/donors', donorRoutes);
app.use('/api/hospitals', hospitalRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/documents', documentRoutes);

// Fallback 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route not found: ${req.method} ${req.originalUrl}`
  });
});

// Centralized error handler
app.use(errorHandler);

// Bootstrap server
async function startServer() {
  try {
    await db.init(process.env.MONGODB_URI);
    await RAGService.initializeIndex();

    app.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`🚀 BloodBridge Backend running on http://localhost:${PORT}`);
      console.log(`🩺 RAG Blood Assistant & Emergency Dispatch Engine Ready`);
      console.log(`====================================================`);
    });
  } catch (err) {
    console.error('Failed to start BloodBridge backend server:', err);
    process.exit(1);
  }
}

startServer();
