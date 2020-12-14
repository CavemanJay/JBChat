import io from "socket.io-client";

const App = () => {
  return (
    <div className="App">
      <div id="message-container">
        <form id="message-form">
          <input type="text" id="message-input" />
          <button type="submit" id="send-button">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default App;
