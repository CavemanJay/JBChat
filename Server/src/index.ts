import { config } from "dotenv";
config();

import express from "express";
import * as fs from "fs";
import * as path from "path";
import * as bodyParser from "body-parser";
import { Room } from "./Models";
import { v4 as uuid } from "uuid";
import http from "http";

import socketIO from "socket.io";

const rooms: Room[] = [
  { id: "General", messages: ["Hi! Welcome to JB Chat!"] },
];

function createRoom(id: string) {
  rooms.push({ id, messages: [] });
}

const app = express();
const server = http.createServer(app);
const io = socketIO(server, { path: "/chat" });

const port = process.env.PORT || "3000";

// io.listen(parseInt(port));

// This allows us to parse json-formatted post requests
app.use(bodyParser.json());

// home route
app.get("/", (req, res) => {
  // const content = fs
  //   .readFileSync(path.join(__dirname, "..", "index.html"))
  //   .toString();

  // response.send(content);

  res.send(`Available rooms: ${JSON.stringify(rooms)}`);
});

app.post("/new_room", (req, res) => {
  rooms.push({ id: uuid(), messages: [] });
  res.sendStatus(200);
});

app.get("/messages", (req, res) => {
  // res.send(messages);
});

app.post("/messages", (req, res) => {
  const { roomId, message } = req.body;

  const targetRoom = rooms.find((room) => room.id === roomId);

  if (targetRoom) {
    targetRoom.messages.push(message);
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

// app.listen(port, () => {
//   console.log("Listening on port " + port);
// });

io.on("connection", (socket) => {
  const { id, room } = socket.handshake.query;

  const targetRoom = rooms.find((x) => x.id === room);

  socket.on("roomNotFoundResponse", (response: string) => {
    if (response.toLowerCase().startsWith("y")) {
      console.log(`Creating room ${room}`);

      createRoom(room);
      socket.join(room);
    } else {
      socket.disconnect();
    }
  });

  if (!targetRoom) {
    console.log(
      `Received connection from user ${id} to room ${room}. Room nonexistent.`
    );

    socket.emit(
      "roomNotFound",
      `The requested room '${room}' does not exist, do you wish to create it? `
    );

    // socket.disconnect();
  }
});

server.listen(port, () => {
  console.log("Listening on port:", port);
});
