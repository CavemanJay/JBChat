import { config } from "dotenv";
config();

import { Message, Room } from "./interfaces";
import http from "http";

import { routes } from "./routes";
import { configureEvents } from "./event listeners";
import * as utils from "./utils";
import { Server, Socket } from "socket.io";

// The current in-memory data structure that stores the rooms and their messages
const rooms: Room[] = [
  {
    id: "General",
    messages: [
      {
        sender: "Server",
        content: "Hi! Welcome to JB Chat!",
      },
    ],
    participants: [],
  },
  {
    id: "Test",
    messages: [],
    participants: [],
  },
];

/**
 * Helper function to create a room with a given id
 * @param id The id of the room
 */
function createRoom(id: string) {
  rooms.push({ id, messages: [], participants: [] });
}

const app = utils.configureExpress(createRoom, rooms);
const server = http.createServer(app);
const io = new Server(server, {
  path: routes.chat,
  cors: {
    // origin: ["localhost:3001"],
    origin: "*",
  },
});

const port = process.env.PORT || "3000";

/**
 * Helper function to send a message to a particular room
 * @param roomId The id of the room
 * @param message The message to send to the room
 */
function sendMessage(roomId: string, message: Message) {
  // Find the target room
  const targetRoom = getRoom(roomId);

  // TODO: If the room doesn't exist (error handling)
  if (!targetRoom) {
    return -1;
  }

  // TODO: Add it to central data store
  targetRoom.messages.push(message);

  // Push message to connected clients
  io.to(targetRoom.id).emit("newMessage", message);
}

function broadcastToAllListeners(message: any) {
  io.sockets.emit("message", message);
}

function getRoom(roomId: string) {
  return rooms.find((x) => x.id === roomId);
}

io.on("connection", (socket: Socket) => {
  utils.log("Received connection from:", socket.client.conn.remoteAddress);

  // @ts-ignore
  let userId: string = socket.handshake.query.userId;
  if (userId && userId === "null") {
    userId = utils.registerUser();
  }

  // Send a list of available rooms
  socket.emit(
    "welcome",
    rooms.map((x) => x.id),
    userId
  );

  socket.join("General");

  rooms[0].participants.push({
    // socket,
    id: userId,
  });

  socket.on("getMessages", (roomId: string) => {
    socket.emit("getMessagesResponse", getRoom(roomId)?.messages);
  });

  socket.on("message", (message: Message, roomId: string) => {
    message.sender = userId;
    // socket.to(roomId).emit("message");

    utils.log("Sending message to clients");

    getRoom(roomId)?.messages.push(message);
    io.in(roomId).emit("message", message);
  });
});

export function start(unitTesting = false) {
  process.env.UT = unitTesting ? "true" : undefined;

  server.listen(port, () => {
    utils.log("Listening on port:", port);
  });
}

export function close() {
  server.close();
}
