import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { makeGetRequest } from "../../requests/helperFunctions";

import { dispatchSetAllStores } from "../../store/allStores";

import "./kh.scss";

import TakeKeyOverlay from "./singlekeys/TakeKeyOverlay";
import ReturnKeyOverlay from "./ReturnKeyOverlay";
import TakeOrReturnOverlay from "./TakeOrReturnOverlay";
import KeysChartView from "./keyschartview/KeysChartView";

const KeysHome = () => {
  const dispatch = useDispatch();
  const nav = useNavigate();

  const s = useSelector((state) => state.allStores);
  const [stores, setStores] = useState([]);

  const [showTakeOrReturnOverlay, setTakeOrReturnOverlay] = useState(false);

  const [showTakeOverlay, setShowTakeOverlay] = useState(false);
  const [showReturnOverlay, setShowReturnOverlay] = useState(false);

  const [allActiveLogs, setAllActiveLogs] = useState([]);

  const [view, setView] = useState(
    window.localStorage.getItem("keysview") || "default"
  );

  useEffect(() => {
    if (s?.length) {
      setStores(s);
    } else {
      async function f() {
        await makeGetRequest("/stores/fetchall/golyek").then((res) => {
          dispatch(
            dispatchSetAllStores(
              res.sort(function (a, b) {
                return a.name.localeCompare(b.name);
              })
            )
          );
        });
      }

      f();
    }
  }, [s]);

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
      <div className="home-krink">Key Checkout</div>

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

        <button
          className="home-add kh-take"
          onClick={() => {
            setView((prev) => {
              const c = prev === "default" ? "chart" : "default";
              window.localStorage.setItem("keysview", c);
              return c;
            });
          }}
          style={{ marginLeft: "15px", backgroundColor: "orange" }}
        >
          Switch View
        </button>
      </div>

      {view === "default" ? (
        <div className="store-mapc">
          {stores
            ?.slice(1)
            ?.filter((t) => t.number < 100)
            ?.map((store) => (
              <div
                className="store-map"
                onClick={() => nav(`/keys/${store?.id}`)}
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
      ) : (
        <KeysChartView />
      )}

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
