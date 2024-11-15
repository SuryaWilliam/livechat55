const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const bodyParser = require("body-parser");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(bodyParser.json());

// In-memory storage for chat sessions (for simplicity; replace with DB in production)
const chatSessions = {};

// API Routes
app.post("/api/session", (req, res) => {
  const { username, description, category } = req.body;
  if (!username || !description || !category) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const sessionId = `session-${Date.now()}`;
  chatSessions[sessionId] = {
    username,
    description,
    category,
    messages: [],
  };

  res.status(201).json({ sessionId });
});

app.get("/api/session", (req, res) => {
  const { sessionId } = req.query;
  const session = chatSessions[sessionId];
  if (!session) {
    return res.status(404).json({ message: "Session not found." });
  }

  res.status(200).json(session);
});

// WebSocket for real-time chat
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("joinSession", (sessionId) => {
    if (!chatSessions[sessionId]) {
      socket.emit("error", "Session not found.");
      return;
    }
    socket.join(sessionId);
    console.log(`User joined session: ${sessionId}`);
  });

  socket.on("sendMessage", ({ sessionId, message }) => {
    if (!chatSessions[sessionId]) {
      socket.emit("error", "Session not found.");
      return;
    }

    const chatMessage = {
      id: `msg-${Date.now()}`,
      text: message.text,
      sender: message.sender,
      timestamp: new Date(),
    };

    chatSessions[sessionId].messages.push(chatMessage);
    io.to(sessionId).emit("receiveMessage", chatMessage);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
