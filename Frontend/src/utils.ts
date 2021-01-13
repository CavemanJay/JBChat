import { Message } from "./models";

const PREFIX = "REACT_APP_";

export function getEnvironmentKey(key: string) {
  return process.env[PREFIX + key];
}

export function getUserId() {
  return localStorage.getItem("id");
}

// export function parseMessage(message: Message) {
//   if (message.sender === getUserId()) {
//     message.sender = "Me";
//   }
//   return message;
// }
