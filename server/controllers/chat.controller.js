const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
} = require("../utils/users");

const handleJoin = (io, socket, { username, room }, callback) => {
  const { error, user } = addUser({ id: socket.id, name: username, room });

  if (error) return callback(error);

  socket.join(user.room);

  socket.emit("receive_message", {
    user: "admin",
    text: `${user.name}, welcome to room ${user.room}.`,
    time: new Date().toLocaleTimeString(),
  });
  socket.broadcast.to(user.room).emit("receive_message", {
    user: "admin",
    text: `${user.name} has joined!`,
    time: new Date().toLocaleTimeString(),
  });

  io.to(user.room).emit("room_users", getUsersInRoom(user.room));

  callback();
};

const handleMessage = (io, socket, message, callback) => {
  const user = getUser(socket.id);

  if (user) {
    socket.broadcast.to(user.room).emit("receive_message", {
      user: user.name,
      text: message,
      author: user.name,
      message: message,
      time: new Date().toLocaleTimeString(),
    });
  }

  callback();
};

const handleDisconnect = (io, socket) => {
  const user = removeUser(socket.id);

  if (user) {
    io.to(user.room).emit("receive_message", {
      user: "admin",
      text: `${user.name} has left.`,
      author: "System",
      message: `${user.name} has left the room`,
      time: new Date().toLocaleTimeString(),
    });
    io.to(user.room).emit("room_users", getUsersInRoom(user.room));
  }
};

module.exports = { handleJoin, handleMessage, handleDisconnect };
