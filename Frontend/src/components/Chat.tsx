import React, { useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { Message } from "../models";

type TParams = { id: string };

// TODO: Show error message if room does not exist

export const Chat = ({ match }: RouteComponentProps<TParams>) => {
  const [messages, setMessages] = useState<Message[]>([
    { content: "Suh", sender: "Jaydlc" },
  ]);
  const [loading, setLoading] = useState(false);
  const [messageToSend, setMessageToSend] = useState("");

  if (loading) {
    return <div>Loading messages...</div>;
  } else {
    return (
      <>
        <p>{JSON.stringify({ messageToSend })}</p>
        <hr />
        <h1>{match.params.id}</h1>

        <h2>Messages</h2>

        {messages.map((message, i) => (
          <div key={i}>
            <span>{message.content}</span>
          </div>
        ))}

        {/* Message sending area (should be its own component) */}
        <div className="message_sender">
          <textarea
            value={messageToSend}
            onChange={(e) => setMessageToSend(e.target.value)}
          />

          <button onClick={(e) => null}>Send</button>
        </div>
      </>
    );
  }
};
