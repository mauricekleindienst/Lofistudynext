// pages/api/socket.js
import { Server } from "socket.io";

export default function handler(req, res) {
  if (res.socket.server.io) {
    console.log("Socket is already running");
    res.end();
    return;
  }

  console.log("Setting up socket server");
  const io = new Server(res.socket.server);
  res.socket.server.io = io;

  const rooms = {}; // Object to store room details

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    socket.on("join-room", (roomId) => {
      socket.join(roomId);
      console.log(`Socket ${socket.id} joined room ${roomId}`);

      // If the room does not exist, create it
      if (!rooms[roomId]) {
        rooms[roomId] = {
          users: [],
          videoId: null,
          currentTime: 0,  // Start video time at 0
          isPlaying: false, // Video is paused initially
        };
      }
      rooms[roomId].users.push(socket.id);

      // Send the current video state (videoId, currentTime, isPlaying) to the newly joined user
      socket.emit('sync-video', {
        videoId: rooms[roomId].videoId,
        currentTime: rooms[roomId].currentTime,
        isPlaying: rooms[roomId].isPlaying,
      });

      // Broadcast the updated user list to the room
      io.to(roomId).emit("user-list-update", rooms[roomId].users);

      // Handle playing video and sync the current time across the room
      socket.on("play-video", (data) => {
        const { videoId, currentTime } = data;
        rooms[roomId].videoId = videoId;
        rooms[roomId].currentTime = currentTime;
        rooms[roomId].isPlaying = true;

        // Broadcast play-video with the time to all users except the sender
        socket.to(roomId).emit("play-video", { videoId, currentTime });
      });

      // Handle pausing video and sync the current time across the room
      socket.on("pause-video", (currentTime) => {
        rooms[roomId].currentTime = currentTime;
        rooms[roomId].isPlaying = false;

        // Broadcast pause-video with the time to all users except the sender
        socket.to(roomId).emit("pause-video", currentTime);
      });

      // Handle time updates to ensure synchronization (for scrubbing through video)
      socket.on("sync-time", (currentTime) => {
        rooms[roomId].currentTime = currentTime;

        // Broadcast the updated time to all users except the sender
        socket.to(roomId).emit("sync-time", currentTime);
      });

      // Handle disconnect event and remove the user from the room
      socket.on("disconnect", () => {
        console.log(`Socket ${socket.id} disconnected from room ${roomId}`);

        // Remove the socket from the room's user list
        rooms[roomId].users = rooms[roomId].users.filter((id) => id !== socket.id);

        // If the room is empty, delete the room
        if (rooms[roomId].users.length === 0) {
          delete rooms[roomId];
        } else {
          // Broadcast the updated user list to the room
          io.to(roomId).emit("user-list-update", rooms[roomId].users);
        }
      });
    });
  });

  res.end();
}
