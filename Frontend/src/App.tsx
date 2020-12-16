import io from "socket.io-client";
import React, { useState, useEffect } from "react";

const App = () => {
  const [socket, setSocket] = useState<SocketIOClient.Socket>(Object);
  const [message, setMessage] = useState("");
  const [rooms, setRooms] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const initializeSocket = () => {
    const _socket = io("http://localhost:3000", {
      path: "/chat",
      // query: { id: "Jay", room: "General" },
    });

    _socket.on("welcome", (rooms: string[]) => {
      setRooms(rooms);
      setLoading(false);
    });

    _socket.connect();
    setSocket(_socket);
  };

  // Code to run on initialization
  useEffect(() => {
    initializeSocket();
  }, []);

  const changeMessage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const joinRoom = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    room: string
  ) => {
    // Implement some sort of routing
  };

  const sendMessage = () => {};

  if (loading) {
    return <div>Loading...</div>;
  } else {
    return (
      <div className="App">
        <p>{JSON.stringify({ message, rooms })}</p>
        <hr />

        {rooms.map((room) => (
          <div key={room} className="room_card">
            <p>Name: {room}</p>
            <p>Participants: Unknown</p>
            <button onClick={(e) => joinRoom(e, room)}>Join</button>
          </div>
        ))}
        {/* <div id="message-container">
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
        </div> */}
      </div>
    );
  }
};

export default App;
