import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { makeGetRequest } from "../../requests/helperFunctions";

import "./kh.scss";

import TakeKeyOverlay from "./singlekeys/TakeKeyOverlay";
import ReturnKeyOverlay from "./ReturnKeyOverlay";
import TakeOrReturnOverlay from "./TakeOrReturnOverlay";

const KeysHome = () => {
  const nav = useNavigate();

  const stores = useSelector((state) => state.allStores);

  const [showTakeOrReturnOverlay, setTakeOrReturnOverlay] = useState(false);

  const [showTakeOverlay, setShowTakeOverlay] = useState(false);
  const [showReturnOverlay, setShowReturnOverlay] = useState(false);

  const [allActiveLogs, setAllActiveLogs] = useState([]);

  useEffect(() => {
    const url = new URL(window.location.href);
    const search = new URLSearchParams(url.search).get("take");
    if (search === "true") setTakeOrReturnOverlay(true);
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
          onClick={() => {
            document.querySelector("html").style.overflow = "hidden";
            setShowTakeOverlay(true);
          }}
        >
          Take Key
        </button>

        <button
          className="home-add kh-take kh-return"
          onClick={() => {
            document.querySelector("html").style.overflow = "hidden";
            setShowReturnOverlay(true);
          }}
          style={{ marginLeft: "15px" }}
        >
          Return Key
        </button>
      </div>

      <div className="store-mapc">
        {stores?.slice(1)?.map((store) => (
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

      {showTakeOrReturnOverlay && (
        <TakeOrReturnOverlay
          setTakeOrReturnOverlay={setTakeOrReturnOverlay}
          setShowReturnOverlay={setShowReturnOverlay}
          setShowTakeOverlay={setShowTakeOverlay}
        />
      )}
    </div>
  );
};

export default KeysHome;
