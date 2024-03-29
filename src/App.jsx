import React, { useEffect, useState } from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { makeGetRequestWithAuth } from "./requests/helperFunctions";

import "./index.scss";
import "atropos/css";
import "./components/customdateselector/cds.scss";

import $ from "jquery";

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
import PrintProductInfo from "./components/productinfo/PrintProductInfo";
import PrintListInfo from "./components/productinfo/printlist/PrintListInfo";
import CallLogs from "./components/calls/CallLogs";
import SingleStoreCallLog from "./components/calls/singlestorecalllog/SingleStoreCallLog";
import Employees from "./components/employees/Employees";
import TimeTracker from "./components/timetracker/TimeTracker";
import SingleTracker from "./components/timetracker/SingleTracker";
import VisitTracker from "./components/store-visit-tracker/VisitTracker";
import Cars from "./components/cars/Cars";
import SingleCar from "./components/cars/SingleCar.jsx";

const App = () => {
  const dispatch = useDispatch();
  // const match = useMatch("/r/:id");

  const sidebarState = useSelector((state) => state.sidebarState);
  const datePickerState = useSelector((state) => state.datePicker);
  const loading = useSelector((state) => state.loading);
  const authstate = useSelector((state) => state.auth);

  const [ready, setReady] = useState(false);

  //if the link is a qr code redirect
  const [qrRedirect, setQrRedirect] = useState(false);

  useEffect(() => {
    if (!authstate?.id) return;

    async function fetchall() {
      makeGetRequestWithAuth(
        `stores/fetchall`,
        import.meta.env.VITE_ROUTEPASS
      ).then((res) => {
        function sorting(a, b) {
          const num1 = Number(a.name.slice(0, 2));
          const num2 = Number(b.name.slice(0, 2));

          if (num1 > num2) return 1;
          if (num1 < num2) return -1;
          return 0;
        }

        dispatch(dispatchSetAllStores(res.sort(sorting)));
      });
    }

    fetchall();
  }, [authstate]);

  useEffect(() => {
    $(window).on("resize", () => {
      dispatch(dispatchSetScreenWidth(window.innerWidth));
    });
  }, []);

  useEffect(() => {
    dispatch(getLocalData());
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [window.location.href]);

  useEffect(() => {
    if (authstate.loading === true) return;

    if (window.location.href.includes("/r/")) {
      setQrRedirect(true);
      return;
    }

    //not logged in redirect
    if (!window.location.href.includes("/keys")) {
      if (window.location.pathname !== "/login") {
        if (authstate.loading === "false" && !authstate.id) {
          //to handle qr code redirects
          window.location.href = "/login";
        }
      }
    }

    setReady(true);
  }, [window.location.pathname, authstate]);

  if (qrRedirect) {
    return (
      <BrowserRouter>
        <Routes>
          <Route exact path="/r/:id" element={<RedirectQR />} />
        </Routes>
      </BrowserRouter>
    );
  }

  if (!window.location.href.includes("/keys")) {
    if (
      (window.location.pathname !== "/login" &&
        authstate.loading === "false" &&
        !authstate.id) ||
      !ready ||
      authstate.loading === true
    ) {
      return (
        <div className="abs-loading2">
          <div className="lds-ring" id="spinner-form">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      );
    }
  }

  return (
    <div>
      {!window.location.href.includes("login") &&
        !window.location.href.includes("signup") &&
        !window.location.href.includes("test") && <BurgerIcon />}

      <BrowserRouter>
        {!window.location.href.includes("login") &&
          !window.location.href.includes("signup") && <Sidebar />}
        {sidebarState?.display && (
          <div
            className="side-blur"
            style={{
              zIndex: !sidebarState.display && -1000,
            }}
            onClick={() =>
              dispatch(dispatchSetSidebarState({ display: false }))
            }
          />
        )}

        {datePickerState?.display && <CustomDateSelector />}

        {loading && (
          <div className="abs-loading" style={{ backgroundColor: "black" }}>
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

          {/*list routes */}
          <Route exact path="/lists/:id" element={<SingleList />} />
          <Route exact path="/lists/print/:id" element={<PrintProductInfo />} />
          <Route
            exact
            path="/lists/printlist/:id"
            element={<PrintListInfo />}
          />

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
          <Route exact path="/keys/k/:id" element={<SingleStoreKey />} />

          {/* QR routes*/}
          <Route exact path="/qr" element={<QR />} />
          <Route exact path="/qr/:id" element={<SingleQR />} />
          <Route exact path="/r/:id" element={<RedirectQR />} />

          {/* print routes*/}
          <Route exact path="/print" element={<Print />} />
          <Route exact path="/print/:id" element={<SinglePrintList />} />
          <Route exact path="/printlist/:id/:qty" element={<PrintList />} />

          {/* call log routes */}
          <Route exact path="/calls" element={<CallLogs />} />
          <Route
            exact
            path="/calls/:storeid"
            element={<SingleStoreCallLog />}
          />

          {/* users routes */}
          <Route exact path="/employees" element={<Employees />} />

          {/* time tracker routes */}
          <Route exact path="/time" element={<TimeTracker />} />
          <Route exact path="/time/:id" element={<SingleTracker />} />

          {/* store visit tracker routes */}
          <Route exact path="/visit" element={<VisitTracker />} />

          {/* car tracker routes */}
          <Route exact path="/cars" element={<Cars />} />
          <Route exact path="/cars/c/:id" element={<SingleCar />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
