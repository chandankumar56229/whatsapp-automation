const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cors = require('cors');
const { Server } = require('socket.io');
const http = require('http');

// Load Env
dotenv.config();

// Create Express Server
const app = express();
const server = http.createServer(app);

// Setup Socket.io for Real-Time React Dashboard
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Pass Socket to Routes via global Express app instance
app.set('socketio', io);

// Security Middlewares (Senior Developer Best Practices)
app.use(helmet()); // Hides metadata from hackers
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000" }));
app.use(express.json()); // Parse JSON requests

// Connect to Database (MongoDB to save chat history)
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('📦 Database Connected Successfully'))
    .catch((err) => console.error('❌ Database Connection Error:', err));
} else {
  console.warn('⚠️  MONGODB_URI not set - Missing Database credentials');
}

// Routes
const webhookRoutes = require('./routes/webhook.routes');
const messageController = require('./controllers/message.controller');

app.use('/webhook', webhookRoutes);

// Bug Fix: Added /send Custom API so Client can manually reply to customers
app.post('/send', messageController.sendManualMessage);

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: "ok", message: "WhatsApp Bot Sever Running!" });
});

// Socket.io Connection Event
io.on('connection', (socket) => {
  console.log(`📡 New Client (Dashboard) Connected: ${socket.id}`);
  
  socket.on('disconnect', () => {
    console.log(`🔌 Client Disconnected: ${socket.id}`);
  });
});

// Start Server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`🚀 Server starting Phase 1 Check...`);
  console.log(`🌍 Server Listening on Port: ${PORT}`);
  console.log(`🔗 Awaiting ngrok hook for /webhook...`);
});
