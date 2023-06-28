import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import "./store.scss";

const Stores = () => {
  const nav = useNavigate();

  const stores = useSelector((state) => state.allStores);

  return (
    <div className="home-parent">
      <img className="home-logo" src="/assets/logo.jpeg" />
      <div className="home-krink">Inventory Stores</div>

      <div className="store-mapc">
        {stores?.map((store) => (
          <div
            className="store-map"
            onClick={() => nav(`/stores/${store?.id}`)}
          >
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

export default Stores;
