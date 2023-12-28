import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { makeGetRequestWithAuth } from "../../requests/helperFunctions";
import { getToken } from "../../requests/getToken";

import Top from "../global/Top";
import LoadingComponent from "../global/LoadingComponent";
import TakeCarOverlay from "./overlay/TakeCarOverlay";
import ReturnCarOverlay from "./overlay/ReturnCarOverlay";

const SingleCar = () => {
  const params = useParams();

  const carTrackers = useSelector((state) => state.carTrackers);

  console.log(carTrackers);

  const [selectedTracker, setSelectedTracker] = useState(null);

  const [currentActiveInput, setCurrentActiveInput] = useState(null);

  //show overlay states
  const [showTakeCarOverlay, setTakeCarOverlay] = useState(false);
  const [showReturnCarOverlay, setShowReturnCarOverlay] = useState(false);

  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const id = params.id;

    async function f() {
      await makeGetRequestWithAuth(`cars/fetchone/${id}`, getToken()).then(
        (res) => {
          if (res === "not found") {
            setNotFound(true);
            return;
          }

          if (res?.id) {
            setSelectedTracker(res);
          }
        }
      );
    }

    //if car tracker state has the current tracker, no need to refetch
    if (carTrackers && !carTrackers.loading) {
      if (carTrackers?.find((t) => t.id === id)) {
        setSelectedTracker(
          carTrackers.find((t) => t.id === id),
          getToken()
        );
      } else {
        f();
      }
    } else {
      f();
    }
  }, [params, window.location.href, carTrackers]);

  useEffect(() => {
    if (!selectedTracker?.id) return;

    const inputs = selectedTracker.trackerInputs;

    //find the one tracker with no return time
    //means it is active
    const findActiveInput = inputs.find((t) => !t.returnTime);

    if (findActiveInput) {
      setCurrentActiveInput(findActiveInput);
    }
  }, [selectedTracker]);

  if (notFound) {
    return (
      <div className="home-parent">
        <Top text={"Not Found"} />
      </div>
    );
  }

  if (!selectedTracker?.id) {
    return (
      <div>
        <LoadingComponent />
      </div>
    );
  }

  return (
    <div className="home-parent">
      <Top text={selectedTracker.name} href={"/cars"} />

      {currentActiveInput && (
        <div className="car-info">
          <div className="f-s-main car-t">
            Current Taken By: {currentActiveInput?.takenBy}
          </div>

          <div className="f-s-main car-t">
            Current Take Time:{" "}
            {new Date(currentActiveInput?.takeTime).toLocaleString("en-us", {
              timeZone: "America/Chicago",
            })}
          </div>
        </div>
      )}

      <div>
        <div className="home-f home-lp">
          History <div className="grow" />
          {!currentActiveInput ? (
            <div
              className="home-add home-create"
              onClick={(e) => {
                e.stopPropagation();
                setTakeCarOverlay({ display: true, car: selectedTracker });
              }}
            >
              Take Car
            </div>
          ) : (
            <div
              className="home-add home-create"
              style={{ backgroundColor: "orange" }}
              onClick={(e) => {
                e.stopPropagation();
                setShowReturnCarOverlay({
                  display: true,
                  car: selectedTracker,
                });
              }}
            >
              Return Car
            </div>
          )}
        </div>

        {selectedTracker.trackerInputs.length < 1 ? (
          <div className="f-s-main" style={{ marginTop: "12px" }}>
            No history for this car
          </div>
        ) : (
          ""
        )}
      </div>

      {showTakeCarOverlay?.display && (
        <TakeCarOverlay
          setState={setTakeCarOverlay}
          state={showTakeCarOverlay}
          setSelectedTracker={setSelectedTracker}
        />
      )}

      {showReturnCarOverlay && (
        <ReturnCarOverlay
          setState={setShowReturnCarOverlay}
          state={showReturnCarOverlay}
        />
      )}
    </div>
  );
};

export default SingleCar;
