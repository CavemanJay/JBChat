export type Socket = {
  port: number;
  ipAddress: string;
};

import express from "express";
import { createServer } from "http";

const app = express();
const http = createServer(app);

app.get("/", (req, res, next) => {
  res.send("<h1>Hello World</h1>");
});

const port = Number.parseInt(process.env.PORT ?? "") || 3000;

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

let connection: Socket = { ipAddress: "127.0.0.1", port: 80 };

function connectToServer(cnn: { src: Socket; dest: Socket }) {}
