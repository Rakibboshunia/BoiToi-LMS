const socketIo = require("socket.io");
const jwt = require("jsonwebtoken");

const initSocket = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // Middleware – authenticate socket connections via token
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Authentication error"));
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch {
      next(new Error("Authentication error"));
    }
  });

  // Track online users
  const onlineUsers = new Map(); // userId -> socketId

  io.on("connection", (socket) => {
    const userId = socket.user?.id;
    console.log(`🔌 Connected: ${socket.id} (user: ${userId})`);

    if (userId) {
      onlineUsers.set(userId, socket.id);
      // Join personal room for direct notifications
      socket.join(userId);
      // Broadcast updated online list
      io.emit("online_users", Array.from(onlineUsers.keys()));
    }

    // ─── Course room ────────────────────────────────────────────────
    socket.on("join_course", (courseId) => {
      socket.join(`course_${courseId}`);
    });

    socket.on("leave_course", (courseId) => {
      socket.leave(`course_${courseId}`);
    });

    // ─── Live class ──────────────────────────────────────────────────
    socket.on("join_live_class", (roomId) => {
      socket.join(`live_${roomId}`);
      socket.to(`live_${roomId}`).emit("user_joined_live", { userId, socketId: socket.id });
    });

    socket.on("leave_live_class", (roomId) => {
      socket.to(`live_${roomId}`).emit("user_left_live", { userId });
      socket.leave(`live_${roomId}`);
    });

    // ─── Live class chat ─────────────────────────────────────────────
    socket.on("live_message", ({ roomId, message }) => {
      io.to(`live_${roomId}`).emit("live_message", {
        userId,
        userName: socket.user?.name || "Anonymous",
        message,
        timestamp: Date.now(),
      });
    });

    // ─── Course discussion / messages ────────────────────────────────
    socket.on("course_message", ({ courseId, message }) => {
      io.to(`course_${courseId}`).emit("course_message", {
        userId,
        userName: socket.user?.name || "Anonymous",
        message,
        timestamp: Date.now(),
      });
    });

    // ─── Typing indicators ────────────────────────────────────────────
    socket.on("typing_start", ({ roomId }) => {
      socket.to(roomId).emit("typing_start", { userId, userName: socket.user?.name });
    });

    socket.on("typing_stop", ({ roomId }) => {
      socket.to(roomId).emit("typing_stop", { userId });
    });

    // ─── Disconnect ───────────────────────────────────────────────────
    socket.on("disconnect", () => {
      onlineUsers.delete(userId);
      io.emit("online_users", Array.from(onlineUsers.keys()));
      console.log(`🔌 Disconnected: ${socket.id}`);
    });
  });

  return io;
};

module.exports = { initSocket };
