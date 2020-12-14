import { config } from "dotenv";
config();

import { Message, Room } from "./interfaces";
import http from "http";

import socketIO from "socket.io";
import { routes } from "./routes";
import { configureEvents } from "./event listeners";
import * as utils from "./utils";

// The current in-memory data structure that stores the rooms and their messages
const rooms: Room[] = [
  {
    id: "General",
    messages: [
      {
        sender: "Jay",
        content: "Hi! Welcome to JB Chat!",
      },
    ],
  },
];

/**
 * Helper function to create a room with a given id
 * @param id The id of the room
 */
function createRoom(id: string) {
  rooms.push({ id, messages: [] });
}

const app = utils.configureExpress(createRoom, rooms);
const server = http.createServer(app);
const io = socketIO(server, { path: routes.chat });

const port = process.env.PORT || "3000";

/**
 * Helper function to send a message to a particular room
 * @param roomId The id of the room
 * @param message The message to send to the room
 */
function sendMessage(roomId: string, message: Message) {
  // Find the target room
  const targetRoom = rooms.find((room) => room.id === roomId);

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

io.on("connection", (socket) => {
  // Read parameters from the initial handshake
  const { id, room }: { id: string; room: string } = socket.handshake.query;
  utils.log("Received connection");

  // Find the room that the client wants to join
  const targetRoom = rooms.find((x) => x.id === room);

  // Configure socket event listeners
  configureEvents(
    socket,
    id,
    room,
    createRoom,
    (message: Message) => {
      // console.log(message);
      sendMessage(room, message);
    },
    broadcastToAllListeners
  );

  // If the room the client wants to join does not exist
  if (!targetRoom) {
    utils.log(
      `Received connection from user ${id} to room ${room}. Room nonexistent.`
    );

    // Notify the client that the room does not exist
    socket.emit("roomNotFound", `The requested room '${room}' does not exist`);
  } else {
    socket.join(targetRoom.id);

    socket.emit("joinedRoom", {
      content: `You have joined room: ${targetRoom.id}`,
      sender: "Server",
    });
  }
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
