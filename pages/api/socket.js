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
        videoId: rooms[roomId].videoId || null,  // Send null if no video is set yet
        currentTime: rooms[roomId].currentTime,
        isPlaying: rooms[roomId].isPlaying,
      });

      // Broadcast the updated user list to the room
      io.to(roomId).emit("user-list-update", rooms[roomId].users);

      // Handle play-video event
      socket.on("play-video", (data) => {
        const { videoId, currentTime } = data;
        rooms[roomId].videoId = videoId;
        rooms[roomId].currentTime = currentTime;
        rooms[roomId].isPlaying = true;

        // Emit the play-video event to all other users in the room
        socket.to(roomId).emit("play-video", { videoId, currentTime });
      });

      // Handle pause-video event
      socket.on("pause-video", (currentTime) => {
        rooms[roomId].currentTime = currentTime;
        rooms[roomId].isPlaying = false;

        // Emit the pause-video event to all other users in the room
        socket.to(roomId).emit("pause-video", currentTime);
      });

      // Handle sync-time updates (for scrubbing)
      socket.on("sync-time", (currentTime) => {
        rooms[roomId].currentTime = currentTime;

        // Emit sync-time event to all other users in the room
        socket.to(roomId).emit("sync-time", currentTime);
      });

      // Handle disconnect event and remove the user from the room
      socket.on("disconnect", () => {
        console.log(`Socket ${socket.id} disconnected from room ${roomId}`);

        // Remove user from room
        rooms[roomId].users = rooms[roomId].users.filter((id) => id !== socket.id);

        // Clean up the room if no users are left
        if (rooms[roomId].users.length === 0) {
          delete rooms[roomId];  // Remove the room from the rooms object
        } else {
          // If users remain, update their user list
          io.to(roomId).emit("user-list-update", rooms[roomId].users);
        }
      });
    });
  });

  res.end();
}
