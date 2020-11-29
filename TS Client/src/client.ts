import io from "socket.io-client";
import promptSync from "prompt-sync";

const prompt = promptSync();

const socket = io("http://localhost:3000", {
  path: "/chat",
  query: { id: "Jay", room: "General" },
});

socket.connect();

socket.on("roomNotFound", (message: string) => {
  const response = prompt(message);
  socket.emit("roomNotFoundResponse", response);
});

interface Message {
  sender: string;
  content: string;
}

socket.on("newMessage", (message: Message) => {
  console.log(message);
});

// Once we have connected to a room
socket.on("joinedRoom", (message: Message) => {
  displayMessage(message);

  sendMessage("Sup homies");
});

function displayMessage(message: Message) {
  console.log(`${message.sender}: ${message.content}`);
}

function sendMessage(content: string) {
  socket.emit("clientMessage", { sender: "Me", content });
}
