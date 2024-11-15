import io from "socket.io-client";

const SOCKET_SERVER_URL = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL;
const socket = io(SOCKET_SERVER_URL, {
  transports: ["websocket"], // Optional: configure transports if needed
});

export default socket;
