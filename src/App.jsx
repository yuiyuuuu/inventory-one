import React from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Home from "./components/home/Home";

import "./index.scss";

const App = () => {
  return (
    <div>
      {/* for now, keep this as one home page, 
      but later on when more features are added, we can add routers and browserrouter*/}
      <Home />
    </div>
  );
};

export default App;
