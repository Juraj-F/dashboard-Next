'use client';

import { io } from 'socket.io-client';

export const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001' || 'http://localhost:3000',{
  autoConnect: false,
});

socket.on("connect", () => {
  console.log("Connected:", socket.id);
});

socket.on("connect_error", (err) => {
  console.error("Connection error:", err.message);
});

socket.on("disconnect", () => {
  console.log("Disconnected");
});