require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const authRoutes = require('./routes/auth');
const { authenticateToken, authorizeRole } = require('./middleware/authMiddleware');
const http = require('http');
const { Server } = require('socket.io');
const taskRoutes = require('./routes/task');


const app = express();
const PORT = process.env.PORT || 5000;

const server = http.createServer(app); // Create HTTP server for Socket.IO
const io = new Server(server, {
    cors: {
      origin: "*",  // Allow all origins (for testing with Postman)
      methods: ["GET", "POST"],
    },
  });

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);
  
    // Join a room
    socket.on('joinRoom', (room) => {
      socket.join(room);
      console.log(`User ${socket.id} joined room: ${room}`);
      socket.to(room).emit('chat message', `User ${socket.id} joined the room.`);
    });
  
    // Handle chat messages
    socket.on('chat message', ({ room, message }) => {
      console.log(`Message to ${room}: ${message}`);
      io.to(room).emit('chat message', message); // Broadcast message to the room
    });
  
    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB connection error:', err));
