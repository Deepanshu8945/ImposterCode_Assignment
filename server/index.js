const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const router = require("./routes/router");
const {
  handleJoin,
  handleMessage,
  handleDisconnect,
} = require("./controllers/chat.controller");

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(router);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data, callback) => {
    const cb = typeof callback === "function" ? callback : () => {};
    handleJoin(io, socket, data, cb);
  });

  socket.on("send_message", (data, callback) => {
    const cb = typeof callback === "function" ? callback : () => {};
    handleMessage(io, socket, data.message, cb);
  });

  socket.on("typing" , ({room,name}) =>{
    socket.broadcast.to(room).emit("display_typing", name);
  })

  socket.on("disconnect", () => {
    handleDisconnect(io, socket);
  });
});

server.listen(3001, () => {
  console.log("SERVER RUNNING on port 3001");
});
