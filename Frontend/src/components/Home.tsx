import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSocket } from "../contexts/SocketProvider";

export const Home = () => {
  const [message, setMessage] = useState("");
  const [rooms, setRooms] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const socket = useSocket();

  // Code to run on initialization
  useEffect(() => {
    if (!socket) return;

    socket.once("welcome", (rooms: string[]) => {
      setRooms(rooms);
      setLoading(false);
    });
  }, [socket]);

  const changeMessage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  //   const joinRoom = (
  //     event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  //     room: string
  //   ) => {
  //     // Implement some sort of routing
  //   };

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
            {/* <button onClick={(e) => joinRoom(e, room)}>Join</button> */}
            <Link to={`/chat/${room}`}>Join</Link>
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
