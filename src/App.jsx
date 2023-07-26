import React, { useEffect } from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import "./index.scss";
import "atropos/css";

import $ from "jquery";

import { makeGetRequest } from "./components/requests/requestFunctions";

import { dispatchSetScreenWidth } from "./store/global/screenWidth";
import { dispatchSetSidebarState } from "./store/sidebar";
import { dispatchSetAllStores } from "./store/allStores";
import { getLocalData } from "./store/auth/auth";

import SingleList from "./components/singlelist/SingleList";
import Stores from "./components/stores/Stores";
import SingleStore from "./components/stores/SingleStore";
import Sidebar from "./components/sidebar/Sidebar";
import BurgerIcon from "./components/sidebar/BurgerIcon";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import CustomDateSelector from "./components/customdateselector/CustomDateSelector";
import KeysHome from "./components/keys/KeysHome";
import SingleStoreKey from "./components/keys/singlekeys/SingleStoreKey";
import Home from "./components/home/Home";
import QR from "./components/qr/QR.jsx";
import SingleQR from "./components/qr/SingleQR";
import RedirectQR from "./components/qr/RedirectQR";
import Print from "./components/print/Print";
import SinglePrintList from "./components/print/singleprint/SinglePrintList";
import PrintList from "./components/print/singleprint/PrintList";

const App = () => {
  const dispatch = useDispatch();

  const sidebarState = useSelector((state) => state.sidebarState);
  const datePickerState = useSelector((state) => state.datePicker);
  const loading = useSelector((state) => state.loading);

  useEffect(() => {
    async function fetchall() {
      makeGetRequest(`stores/fetchall/${import.meta.env.VITE_ROUTEPASS}`).then(
        (res) => {
          function sorting(a, b) {
            const num1 = Number(a.name.slice(0, 2));
            const num2 = Number(b.name.slice(0, 2));

            if (num1 > num2) return 1;
            if (num1 < num2) return -1;
            return 0;
          }

          dispatch(dispatchSetAllStores(res.sort(sorting)));
        }
      );
    }

    fetchall();
  }, []);

  useEffect(() => {
    $(window).on("resize", () => {
      dispatch(dispatchSetScreenWidth(window.innerWidth));
    });
  }, []);

  useEffect(() => {
    dispatch(getLocalData());
  }, []);

  return (
    <div>
      {!window.location.href.includes("login") &&
        !window.location.href.includes("signup") &&
        !window.location.href.includes("test") && <BurgerIcon />}

      {!window.location.href.includes("login") &&
        !window.location.href.includes("signup") && <Sidebar />}

      <BrowserRouter>
        <div
          className="side-blur"
          style={{
            zIndex: !sidebarState.display && -1000,
          }}
          onClick={() => dispatch(dispatchSetSidebarState({ display: false }))}
        />

        {datePickerState?.display && <CustomDateSelector />}

        {loading && (
          <div className="abs-loading">
            <div className="lds-ring" id="spinner-form">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        )}
        <Routes>
          <Route exact path="/" element={<Home />} />

          <Route exact path="/lists/:id" element={<SingleList />} />

          {/* stores routes*/}
          <Route exact path="/stores" element={<Stores />} />
          <Route exact path="/stores/:id" element={<SingleStore />} />

          {/* auth routes*/}
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/signup" element={<Signup />} />

          {/* testing only routes*/}
          <Route exact path="/test" element={<CustomDateSelector />} />

          {/* keys routes*/}
          <Route exact path="/keys" element={<KeysHome />} />
          <Route exact path="/keys/:id" element={<SingleStoreKey />} />

          {/* QR routes*/}
          <Route exact path="/qr" element={<QR />} />
          <Route exact path="/qr/:id" element={<SingleQR />} />
          <Route exact path="/r/:id" element={<RedirectQR />} />

          {/* print routes*/}
          <Route exact path="/print" element={<Print />} />
          <Route exact path="/print/:id" element={<SinglePrintList />} />
          <Route exact path="/printlist/:id/:qty" element={<PrintList />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
