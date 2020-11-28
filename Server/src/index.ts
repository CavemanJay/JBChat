import { config } from "dotenv";
config();

import express from "express";
import * as bodyParser from "body-parser";
import { Message, Room } from "./interfaces";
import { v4 as uuid } from "uuid";
import http from "http";

import socketIO from "socket.io";
import { routes } from "./routes";
import { configureEvents } from "./event listeners";

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

function createRoom(id: string) {
  rooms.push({ id, messages: [] });
}

const app = express();
const server = http.createServer(app);
const io = socketIO(server, { path: routes.chat });

const port = process.env.PORT || "3000";

// io.listen(parseInt(port));

// This allows us to parse json-formatted post requests
app.use(bodyParser.json());

// home route
app.get(routes.base, (req, res) => {
  // const content = fs
  //   .readFileSync(path.join(__dirname, "..", "index.html"))
  //   .toString();

  // response.send(content);

  res.send(`Available rooms: ${JSON.stringify(rooms)}`);
});

app.post(routes.newRoom, (req, res) => {
  rooms.push({ id: uuid(), messages: [] });
  res.sendStatus(200);
});

app.get(routes.messages, (req, res) => {
  // res.send(messages);
});

app.post(routes.messages, (req, res) => {
  const { roomId, message } = req.body;

  const targetRoom = rooms.find((room) => room.id === roomId);

  if (targetRoom) {
    targetRoom.messages.push(message);
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

// Helper function to send a message to a particular room
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

io.on("connection", (socket) => {
  const { id, room } = socket.handshake.query;

  const targetRoom = rooms.find((x) => x.id === room);

  // Configure socket event listeners
  configureEvents(socket, room, createRoom, (message: Message) => {
    // TODO: Figure out how to tie the message from the client to the room it is in
  });

  // If the room the client wants to join does not exist
  if (!targetRoom) {
    console.log(
      `Received connection from user ${id} to room ${room}. Room nonexistent.`
    );

    socket.emit(
      "roomNotFound",
      `The requested room '${room}' does not exist, do you wish to create it? `
    );
  } else {
    socket.join(targetRoom.id);

    socket.emit("joinedRoom", {
      content: `You have joined room: ${targetRoom.id}`,
      sender: "Server",
    });
  }
});

server.listen(port, () => {
  console.log("Listening on port:", port);
});
