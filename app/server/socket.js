import http from "http";
import { Server } from "socket.io";

const httpServer = http.createServer();

export const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3001",
    credentials: true,
  },
});

httpServer.listen(4000, () => {
  console.log("Socket.IO server running on port 4000");
});