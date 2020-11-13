import io from "socket.io-client";
import promptSync from "prompt-sync";
const prompt = promptSync();

const socket = io("http://localhost:3000", {
  path: "/chat",
  query: { id: "Jay", room: "Generala" },
});

socket.connect();

socket.on("roomNotFound", (message: string) => {
  //   console.log(message);

  const response = prompt(message);
  socket.emit("roomNotFoundResponse", response);
});
// socket.disconnect();
