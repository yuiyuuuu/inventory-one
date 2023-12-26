import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { makeGetRequestWithAuth } from "../../requests/helperFunctions";
import { getToken } from "../../requests/getToken";

import Top from "../global/Top";

const Cars = () => {
  const dispatch = useDispatch();

  const carTrackers = useSelector((state) => state.carTrackers);

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
    }
  }, [carTrackers]);

  if (carTrackers.loading) {
    return <Loading />;
  }

  return (
    <div className='home-parent'>
      <Top text={"Car Trackers"} />
    </div>
  );
};

export default Cars;
