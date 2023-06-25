import React, { useEffect } from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import "./index.scss";
import "atropos/css";

import $ from "jquery";

import { dispatchSetScreenWidth } from "./store/global/screenWidth";
import { dispatchSetSidebarState } from "./store/sidebar";

import Home from "./components/home/Home";
import Stores from "./components/stores/Stores";
import SingleStore from "./components/stores/SingleStore";
import Sidebar from "./components/sidebar/Sidebar";
import BurgerIcon from "./components/sidebar/BurgerIcon";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";

const App = () => {
  const dispatch = useDispatch();

  const sidebarState = useSelector((state) => state.sidebarState);

  useEffect(() => {
    $(window).on("resize", () => {
      dispatch(dispatchSetScreenWidth(window.innerWidth));
    });
  }, []);

  return (
    <div>
      {!window.location.href.includes("login") &&
        !window.location.href.includes("signup") && <BurgerIcon />}

      {!window.location.href.includes("login") &&
        !window.location.href.includes("signup") && <Sidebar />}

      <BrowserRouter>
        <div
          className='side-blur'
          style={{
            zIndex: !sidebarState.display && -1000,
          }}
          onClick={() => dispatch(dispatchSetSidebarState({ display: false }))}
        />
        <Routes>
          <Route exact path='/' element={<Home />} />
          <Route exact path='/stores' element={<Stores />} />
          <Route exact path='/stores/:id' element={<SingleStore />} />
          <Route exact path='/login' element={<Login />} />
          <Route exact path='/signup' element={<Signup />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
