import { io } from "socket.io-client";

const socket = io("https://kite-backend-rxe8.onrender.com", {
  autoConnect: false,
  withCredentials: true,
});

export default socket;