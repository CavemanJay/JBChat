import * as express from "express";
import * as fs from "fs";
import * as path from "path";
import * as bodyParser from "body-parser";
import { Room } from "./Models";
import { v4 as uuid } from "uuid";

const rooms: Room[] = [];

const app = express();
const port = 3000;

app.use(bodyParser.json());

// home route
app.get("/", (request, response) => {
  // const content = fs
  //   .readFileSync(path.join(__dirname, "..", "index.html"))
  //   .toString();

  // response.send(content);

  response.send(`Available rooms: ${JSON.stringify(rooms)}`);
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
    targetRoom?.messages.push(message);
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

app.listen(port, () => {
  console.log("Listening on port " + port);
});
