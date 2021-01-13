import React, { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { useSocket } from "../contexts/SocketProvider";
import { Message } from "../models";

type TParams = { id: string };

// TODO: Show error message if room does not exist

export const Chat = ({ match }: RouteComponentProps<TParams>) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [messageToSend, setMessageToSend] = useState("");

  const socket = useSocket();
  const roomId = match.params.id;

  useEffect(() => {
    if (!socket) return;

    socket.once("getMessagesResponse", (_messages: Message[]) => {
      setMessages(_messages);
      setLoading(false);
    });

    socket.on("message", (message: Message) => {
      if (message.sender === localStorage.getItem("id")) {
        message.sender = "Me";
      }
      console.log("Message received");

      setMessages((messages) => [...messages, message]);
    });

    socket.emit("getMessages", roomId);

    return () => {
      socket.off("message");
    };
  }, [socket]);

  const sendMessage = (e: any) => {
    const message: Message = {
      content: messageToSend,
      // The sender doesn't matter when sending to the server
      sender: "",
    };

    socket?.emit("message", message, roomId);
    setMessageToSend("");
  };

  if (loading) {
    return <div>Loading messages...</div>;
  } else {
    return (
      <>
        <p>{JSON.stringify({ messageToSend, messages })}</p>
        <hr />
        <h1>{roomId}</h1>

        <h2>Messages</h2>

        {messages.map((message, i) => (
          <div key={i} style={{ padding: "10px" }}>
            <span>
              {message.sender}: {message.content}
            </span>
          </div>
        ))}

        {/* Message sending area (should be its own component) */}
        <div className="message_sender">
          <textarea
            value={messageToSend}
            onChange={(e) => setMessageToSend(e.target.value)}
          />

          <button onClick={sendMessage}>Send</button>
        </div>
      </>
    );
  }
};
