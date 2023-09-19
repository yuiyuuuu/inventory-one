import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import CallLogsStoreMap from "./CallLogsStoreMap";

import "./cl.scss";
import CreateCallLogOverlay from "./CreateCallLogOverlay";
import CallsChartView from "./callschartview/CallsChartView";

const CallLogs = () => {
  const authState = useSelector((state) => state.auth);
  const stores = useSelector((state) => state.allStores);

  const [showCreateOverlay, setShowCreateOverlay] = useState(false);

  const [view, setView] = useState(
    window.localStorage.getItem("callview") === "default"
      ? "default"
      : window.localStorage.getItem("callview") === "chart"
      ? "chart"
      : "default"
  );

  if (authState.loading && authState.loading !== "false") {
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

  return (
    <div className="home-parent">
      <img className="home-logo" src="/assets/logo.jpeg" />
      <div className="home-krink">Call Logs</div>

      <div className="home-t home-q">
        <button
          className="home-add kh-take"
          onClick={() => {
            setShowCreateOverlay(true);
            document.querySelector("html").style.overflow = "hidden";
          }}
        >
          Create
        </button>

        <button
          className="home-add kh-take"
          style={{ marginLeft: "10px", backgroundColor: "orange" }}
          onClick={() => {
            if (view === "default") {
              setView("chart");
              window.localStorage.setItem("callview", "chart");
            } else {
              setView("default");
              window.localStorage.setItem("callview", "default");
            }
          }}
        >
          Switch View
        </button>
      </div>

      {view === "default" ? (
        <div>
          <div className="store-mapc">
            {stores?.slice(1)?.map((store) => (
              <CallLogsStoreMap store={store} />
            ))}
          </div>
        </div>
      ) : (
        <CallsChartView store={stores} />
      )}

      {showCreateOverlay && (
        <CreateCallLogOverlay setShow={setShowCreateOverlay} />
      )}
    </div>
  );
};

export default CallLogs;
