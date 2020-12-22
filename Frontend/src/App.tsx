import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Chat, Home } from "./components";
import { SocketProvider } from "./contexts/SocketProvider";

const App = () => {
  return (
    <SocketProvider>
      <Router>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/chat/:id" component={Chat} />
        </Switch>
      </Router>
    </SocketProvider>
  );
};

export default App;
