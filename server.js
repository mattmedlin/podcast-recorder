const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST"],
  },
});

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"], // Allow requests from your React app
  })
);

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("join-room", (roomId) => {
    try {
      console.log(`Attempting to join room: ${roomId}`);

      if (!roomId) {
        console.error("Room ID is undefined or null");
        return; // Exit early if roomId is not valid
      }

      socket.join(roomId);
      console.log(`Socket ${socket.id} joined room: ${roomId}`);

      // Check if the room exists and has other users
      const room = io.sockets.adapter.rooms.get(roomId);
      if (room && room.size > 1) {
        // size > 1 means there are other participants in the room
        socket.to(roomId).broadcast.emit("user-connected", socket.id);
      } else {
        console.log(`Room ${roomId} is empty or does not exist`);
      }
    } catch (error) {
      console.error("Error joining room:", error);
    }
  });

  socket.on("offer", (payload) => {
    io.to(payload.target).emit("offer", payload);
  });

  socket.on("answer", (payload) => {
    io.to(payload.target).emit("answer", payload);
  });

  socket.on("ice-candidate", (payload) => {
    io.to(payload.target).emit("ice-candidate", payload);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

server.listen(5001, () => console.log("Server is running on port 5001"));
