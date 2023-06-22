import React from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import "./index.scss";

import Home from "./components/home/Home";
import Stores from "./components/stores/Stores";
import SingleStore from "./components/stores/SingleStore";
import Sidebar from "./components/sidebar/Sidebar";
import BurgerIcon from "./components/sidebar/BurgerIcon";
import { dispatchSetSidebarState } from "./store/sidebar";

const App = () => {
  const dispatch = useDispatch();
  const sidebarState = useSelector((state) => state.sidebarState);

  return (
    <div>
      <BurgerIcon />
      <Sidebar />
      <BrowserRouter>
        <div
          className="side-blur"
          style={{
            zIndex: !sidebarState.display && -1000,
          }}
          onClick={() => dispatch(dispatchSetSidebarState({ display: false }))}
        />
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
