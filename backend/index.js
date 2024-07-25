const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

io.on("connection", (socket) => {
  console.log("New client connected", socket.id);

  socket.on("videoStream", (data) => {
    socket.broadcast.emit("videoStream", data);
  });

  socket.on("disconnect", (socket) => {
    console.log("Client disconnected", socket.id);
  });
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
