import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';

import authRoutes from './src/routes/authRoutes.js';
import memberRoutes from './src/routes/memberRoutes.js';
import rewardRoutes from './src/routes/rewardRoutes.js';
import adminRoutes from './src/routes/adminRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Request Logger (real-time) — menggunakan morgan format 'dev'
app.use(morgan('dev'));

// Custom middleware: log method, URL, status, dan response time
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    console.log(`[${req.method}] ${req.originalUrl} → ${res.statusCode} (${Date.now() - start}ms)`);
  });
  next();
});

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'CRM Member Loyalty Backend Service is running.' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/member', memberRoutes);
app.use('/api/reward', rewardRoutes);
app.use('/api/admin', adminRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'API Endpoint tidak ditemukan.' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(` CRM Loyalty Backend Server Running on Port ${PORT}`);
  console.log(` Health Check: http://localhost:${PORT}/api/health`);
  console.log(`=================================================`);
});