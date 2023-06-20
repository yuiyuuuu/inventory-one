import React from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";

import "./index.scss";

import Home from "./components/home/Home";
import Stores from "./components/stores/Stores";
import SingleStore from "./components/stores/SingleStore";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/stores" element={<Stores />} />
          <Route exact path="/stores/:id" element={<SingleStore />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
