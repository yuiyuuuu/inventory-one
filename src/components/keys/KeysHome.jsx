import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import "./kh.scss";

import TakeKeyOverlay from "./singlekeys/TakeKeyOverlay";

const KeysHome = () => {
  const nav = useNavigate();

  const stores = useSelector((state) => state.allStores);

  const [showTakeOverlay, setShowTakeOverlay] = useState(false);

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
    </div>
  );
};

export default KeysHome;
