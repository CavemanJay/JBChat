import io from "socket.io-client";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Chat, Home } from "./components";

const App = () => {
  const [socket, setSocket] = useState<SocketIOClient.Socket>(Object);

  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/chat/:id" component={Chat} />
      </Switch>
    </Router>
  );
};

export default App;
