import { Server } from 'socket.io';

let io;

const allowedOrigins = (process.env.FRONTEND_URLS || process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Join a specific room based on user ID for personal notifications
    socket.on('join', (userId) => {
      console.log(`User ${userId} joined their personal room`);
      socket.join(userId);
    });

    // Join a room for a specific post to get real-time comment updates
    socket.on('join_post', (postId) => {
      console.log(`User joined post room: post_${postId}`);
      socket.join(`post_${postId}`);
    });

    socket.on('leave_post', (postId) => {
      socket.leave(`post_${postId}`);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};
