// server.js

const express = require("express");
const next = require("next");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
require("dotenv").config();

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

let activeAgents = 2; // Number of available agents
let queue = []; // Initialize queue as an empty array

app.prepare().then(() => {
  const server = express();
  const httpServer = http.createServer(server);
  const io = new Server(httpServer);

  // Connect to MongoDB
  mongoose
    .connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.error("MongoDB connection error:", error));

  // Socket.io connection and events
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join_session", (sessionId) => {
      socket.join(sessionId);
    });

    socket.on("join_room", (roomId) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room ${roomId}`);
    });

    socket.on("send_message", (data) => {
      const { roomId, message, sender } = data;
      io.to(roomId).emit("receive_message", { message, sender });
    });

    socket.on("new_message", (msg) => {
      io.to(msg.sessionId).emit("new_message", msg);
    });

    socket.on("typing", ({ sessionId, typing }) => {
      socket.to(sessionId).emit("typing", typing);
    });

    socket.on("join_queue", () => {
      if (activeAgents > 0) {
        activeAgents -= 1;
        socket.emit("join_chat");
      } else {
        const position = queue.push(socket) - 1;
        socket.emit("queue_position", { position });
        io.emit("admin_notification", { type: "queued_user", position });
      }
    });

    socket.on("leave_queue", () => {
      queue = queue.filter((s) => s !== socket);
    });

    socket.on("end_chat", () => {
      activeAgents += 1;
      io.emit("admin_notification", { type: "chat_ended" });

      if (queue.length > 0) {
        const nextSocket = queue.shift();
        nextSocket.emit("join_chat");
        io.emit("admin_notification", {
          type: "queued_user",
          position: queue.length,
        });
      }
    });

    socket.on("join_chat", (sessionId) => {
      socket.join(sessionId);
      io.to(sessionId).emit("agent_joined", { agentId: socket.id });
    });

    socket.on("send_message", ({ sessionId, message }) => {
      io.to(sessionId).emit("receive_message", message);
    });

    socket.on("typing", ({ sessionId, typing, sender }) => {
      socket.to(sessionId).emit("typing", { typing, sender });
    });

    socket.on("end_chat", (sessionId) => {
      io.to(sessionId).emit("chat_ended");
      // Handle removing chat session from active list if needed
    });

    socket.on("new_offline_message", (message) => {
      io.emit("admin_notification", { type: "offline_message", message });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      queue = queue.filter((s) => s !== socket);
    });
  });

  // Next.js handling
  server.all("*", (req, res) => handle(req, res));

  // Server listening
  const PORT = process.env.PORT || 3000;
  httpServer.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Server ready on http://localhost:${PORT}`);
  });
});
