import io from "socket.io-client";
import React, { useState, useEffect } from "react";

const App = () => {
  const [socket, setSocket] = useState<SocketIOClient.Socket>();
  const [message, setMessage] = useState("");

  // Code to run on initialization
  useEffect(() => {
    const _socket = io("http://localhost:3000", {
      path: "/chat",
      query: { id: "Jay", room: "General" },
    });
    setSocket(_socket);
  }, []);

  const changeMessage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const sendMessage = () => {};

  return (
    <div className="App">
      <p>{JSON.stringify({ message })}</p>
      <hr />
      <div id="message-container">
        <form id="message-form">
          <input
            type="text"
            id="message-input"
            value={message}
            onChange={changeMessage}
          />
          <button type="submit" id="send-button" onClick={sendMessage}>
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default App;
