import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import "./kh.scss";

const KeysHome = () => {
  const nav = useNavigate();

  const stores = useSelector((state) => state.allStores);

  return (
    <div className="home-parent">
      <img className="home-logo" src="/assets/logo.jpeg" />
      <div className="home-krink">Inventory Keys</div>

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
    </div>
  );
};

export default KeysHome;
