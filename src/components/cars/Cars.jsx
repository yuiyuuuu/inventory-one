import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { makeGetRequestWithAuth } from "../../requests/helperFunctions";
import { getToken } from "../../requests/getToken";
import { dispatchSetCarTrackers } from "../../store/cartrackers/cars";

import "./c.scss";

import Top from "../global/Top";
import Loading from "../global/LoadingComponent";
import AddCarOverlay from "./overlay/AddCarOverlay";

const Cars = () => {
  const dispatch = useDispatch();
  const nav = useNavigate();

  const carTrackers = useSelector((state) => state.carTrackers);

  const [showAddCarOverlay, setShowAddCarOverlay] = useState(false);

  console.log(carTrackers, "cartrackers");

  useEffect(() => {
    //not loading yet
    if (carTrackers.loading) {
      async function f() {
        await makeGetRequestWithAuth("cars/fetchall", getToken()).then(
          (res) => {
            if (res) {
              dispatch(dispatchSetCarTrackers(res));
            }
          }
        );
      }

      f();
    }
  }, [carTrackers]);

  if (carTrackers.loading) {
    return <Loading />;
  }

  return (
    <div className="home-parent">
      <Top text={"Car Trackers"} />

      <div className="home-f home-lp">
        Car Trackers
        <div className="grow" />
        <div
          className="home-add home-create"
          onClick={() => setShowAddCarOverlay(true)}
        >
          Create
        </div>
      </div>

      {carTrackers.length < 1 ? (
        <div className="f-s-main" style={{ marginTop: "10px" }}>
          No Car Trackers Available
        </div>
      ) : (
        <div className="home-mapcontainer">
          {carTrackers.map((t) => (
            <div className="home-mapch" onClick={() => nav(`/cars/c/${t.id}`)}>
              <div>
                <div className="f-s-main bold">{t.name}</div>
                <div className="f-s-main bold" style={{ marginTop: "5px" }}>
                  {t.plate}
                </div>
              </div>

              <div className="grow" />
              <div
                className="mitem-caret"
                style={{ transform: "rotate(-90deg)" }}
              />
            </div>
          ))}
        </div>
      )}

      {showAddCarOverlay && <AddCarOverlay set={setShowAddCarOverlay} />}
    </div>
  );
};

export default Cars;
