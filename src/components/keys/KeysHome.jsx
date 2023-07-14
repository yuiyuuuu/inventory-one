import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { makeGetRequest } from "../../requests/helperFunctions";

import "./kh.scss";

import TakeKeyOverlay from "./singlekeys/TakeKeyOverlay";
import ReturnKeyOverlay from "./ReturnKeyOverlay";

const KeysHome = () => {
  const nav = useNavigate();

  const stores = useSelector((state) => state.allStores);

  const [showTakeOverlay, setShowTakeOverlay] = useState(false);
  const [showReturnOverlay, setShowReturnOverlay] = useState(false);

  const [allActiveLogs, setAllActiveLogs] = useState([]);

  useEffect(() => {
    const url = new URL(window.location.href);
    const search = new URLSearchParams(url.search).get("take");
    if (search === "true") setShowTakeOverlay(true);
  }, []);

  if (stores.length < 1) {
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
      <div className="home-krink">Inventory Keys</div>

      <div className="home-t home-q">
        <button
          className="home-add kh-take"
          onClick={() => setShowTakeOverlay(true)}
        >
          Take Key
        </button>

        <button
          className="home-add kh-take kh-return"
          onClick={() => setShowReturnOverlay(true)}
          style={{ marginLeft: "15px" }}
        >
          Return Key
        </button>
      </div>

      <div className="store-mapc">
        {stores?.map((store) => (
          <div className="store-map" onClick={() => nav(`/keys/${store?.id}`)}>
            <div className="store-name">{store?.name}</div>
            <div className="grow" />
            <div
              className="mitem-caret"
              style={{ transform: "rotate(-90deg)" }}
            />
          </div>
        ))}
      </div>

      {showTakeOverlay && (
        <TakeKeyOverlay setShowTakeOverlay={setShowTakeOverlay} />
      )}

      {showReturnOverlay && (
        <ReturnKeyOverlay
          setShowTakeOverlay={setShowTakeOverlay}
          setShowReturnOverlay={setShowReturnOverlay}
        />
      )}
    </div>
  );
};

export default KeysHome;
