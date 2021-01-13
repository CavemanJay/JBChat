import { config } from "dotenv";
config();

import http from "http";
import { Server, Socket } from "socket.io";

import { IMessage, IRoom } from "./interfaces";
import { routes } from "./routes";
import { configureEvents } from "./event listeners";
import * as utils from "./utils";
import { ChatManager } from "./database/ChatManager";

// const app = utils.configureExpress(createRoom, rooms);
const app = utils.configureExpress();
const server = http.createServer(app);
const io = new Server(server, {
  path: routes.chat,
  cors: {
    // origin: ["localhost:3001"],
    origin: "*",
  },
});

const port = process.env.PORT || "3000";
let db: ChatManager;

/**
 * Helper function to send a message to a particular room
 * @param roomId The id of the room
 * @param message The message to send to the room
 */
async function sendMessage(roomId: string, message: IMessage) {
  const error = await db.messages.add(roomId, message);
  if (error) {
    utils.log("An error occurred while adding a message to the database", {
      roomId,
      message,
      error,
    });
  }

  // TODO: Maybe this shouldn't happen if there is an error saving it to the database
  io.in(roomId).emit("message", message);
}

function broadcastToAllListeners(message: any) {
  io.sockets.emit("broadcast", message);
}

io.on("connection", async (socket: Socket) => {
  utils.log("Received connection from:", socket.client.conn.remoteAddress);
  const rooms = await db.rooms.all();

  // @ts-ignore
  let userId: string = socket.handshake.query.userId;
  if (userId && userId === "null") {
    userId = utils.newUuid();
  }

  // Send a list of available rooms
  socket.emit(
    "welcome",
    rooms.map((x) => x.id),
    userId
  );

  socket.join("General");

  db.rooms.addParticipant("General", { id: userId });

  configureEvents(socket, db, userId, sendMessage);
});

export function start(unitTesting = false) {
  process.env.UT = unitTesting ? "true" : undefined;

  db = new ChatManager(
    process.env.DB_HOST || "localhost",
    process.env.DB_NAME || "jbchat"
  );

  server.listen(port, () => {
    utils.log("Listening on port:", port);
  });
}

export function close() {
  server.close();
}
