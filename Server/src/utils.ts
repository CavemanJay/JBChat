import * as bodyParser from "body-parser";
import express from "express";
import { v4 as uuid } from "uuid";
import { Room } from "./interfaces";
import { routes } from "./routes";

function unitTesting() {
  return process.env.UT === "true";
}

/**
 * Helper function to log depending on environment variables
 * @param message The message to log
 * @param optionalParams Any extra data to be logged
 */
export function log(message?: any, ...optionalParams: any[]) {
  if (!unitTesting()) console.log(message, ...optionalParams);
}

export function configureExpress(createRoom: Function, rooms: Room[]) {
  const app = express();

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
    createRoom(uuid());
    res.sendStatus(200);
  });

  app.get(routes.messages, (req, res) => {
    // res.send(messages);
  });

  app.post(routes.messages, (req, res) => {
    const { roomId, message } = req.body;

    // const targetRoom = rooms.find((room) => room.id === roomId);

    // if (targetRoom) {
    //   targetRoom.messages.push(message);
    //   res.sendStatus(200);
    // } else {
    //   res.sendStatus(404);
    // }
  });

  return app;
}
