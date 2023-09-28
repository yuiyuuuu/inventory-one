import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import "./store.scss";

const Stores = () => {
  const nav = useNavigate();

  const stores = useSelector((state) => state.allStores);
  const authState = useSelector((state) => state.auth);

  if (
    (authState?.loading === "false" || !authState.loading) &&
    !authState?.id
  ) {
    return (
      <div className="home-parent">
        <img className="home-logo" src="/assets/logo.jpeg" />
        <div className="home-krink">Store Statistics</div>
        <div className="home-none">
          <a className="home-siredir" href="/login">
            Log in
          </a>{" "}
          to view store statistics
        </div>
      </div>
    );
  }
  if (stores.length < 1 || authState.loading) {
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
      <div className="home-krink">Store Statistics</div>
      {authState.loading === "false" && !authState?.id ? (
        <div className="home-none">
          <a className="home-siredir" href="/login">
            Log in
          </a>{" "}
          to see store statistics
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default Stores;
