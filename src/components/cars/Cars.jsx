import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { makeGetRequestWithAuth } from "../../requests/helperFunctions";
import { getToken } from "../../requests/getToken";
import { dispatchSetCarTrackers } from "../../store/cartrackers/cars";

import Top from "../global/Top";
import Loading from "../global/LoadingComponent";

const Cars = () => {
  const dispatch = useDispatch();

  const carTrackers = useSelector((state) => state.carTrackers);

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
    </div>
  );
};

export default Cars;
