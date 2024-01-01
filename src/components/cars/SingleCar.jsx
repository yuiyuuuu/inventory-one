import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { makeGetRequestWithAuth } from "../../requests/helperFunctions";
import { getToken } from "../../requests/getToken";

import Top from "../global/Top";
import LoadingComponent from "../global/LoadingComponent";
import TakeCarOverlay from "./overlay/TakeCarOverlay";
import ReturnCarOverlay from "./overlay/ReturnCarOverlay";
import CarHistoryMap from "./CarHistoryMap";

const SingleCar = () => {
  const params = useParams();

  const carTrackers = useSelector((state) => state.carTrackers);

  const [selectedTracker, setSelectedTracker] = useState(null);

  const [currentActiveInput, setCurrentActiveInput] = useState(null);

  const [showHistory, setShowHistory] = useState(false);

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
    } else {
      setCurrentActiveInput(null);
    }
  }, [selectedTracker]);

  if (notFound) {
    return (
      <div className='home-parent'>
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
    <div className='home-parent'>
      <Top text={selectedTracker.name} href={"/cars"} />

      <div className='car-p'>
        {!currentActiveInput ? (
          <div
            className='home-add home-create car-but'
            onClick={(e) => {
              e.stopPropagation();
              setTakeCarOverlay({ display: true, car: selectedTracker });
            }}
          >
            Take Car
          </div>
        ) : (
          <div
            className='home-add home-create car-but'
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

      {currentActiveInput && (
        <div className='car-info'>
          <div className='f-s-main car-t'>
            Current Taken By: {currentActiveInput?.takenBy}
          </div>

          <div className='f-s-main car-t'>
            Current Take Time:{" "}
            {new Date(currentActiveInput?.takeTime).toLocaleString("en-us", {
              timeZone: "America/Chicago",
            })}
          </div>
        </div>
      )}

      <div style={{ margin: "20px 0" }}>
        <div className='home-f home-lp'>
          Car Info <div className='grow' />
        </div>

        <div style={{ marginTop: "15px" }}>
          <div className='f-s-main car-histinfo'>
            <span className='bold'>Car Name: </span>
            {selectedTracker.name}
          </div>

          <div className='f-s-main car-histinfo'>
            <span className='bold'>Car Plate: </span>
            {selectedTracker.plate}
          </div>

          <div className='f-s-main car-histinfo'>
            <span className='bold'>Last Service Date: </span>
            {selectedTracker.lastSeriveDate
              ? new Date(selectedTracker.lastSeriveDate).toLocaleString(
                  "en-us",
                  {
                    timeZone: "America/Chicago",
                  }
                )
              : "---"}
          </div>
        </div>
      </div>

      <div>
        <div
          className='home-f home-lp pointer'
          onClick={() => setShowHistory((prev) => !prev)}
        >
          History <div className='grow' />
          <div
            className='mitem-caret'
            style={{ transform: !showHistory && "rotate(-90deg)" }}
          />
        </div>
        {showHistory && (
          <div>
            {selectedTracker.trackerInputs.filter((t) => t.returnTime).length <
            1 ? (
              <div className='f-s-main' style={{ marginTop: "12px" }}>
                No history for this car
              </div>
            ) : (
              <div className='car-maphistory'>
                {selectedTracker.trackerInputs
                  .filter((t) => t.returnTime)
                  .sort((a, b) => {
                    return (
                      new Date(b.returnTime).getTime() -
                      new Date(a.returnTime).getTime()
                    );
                  })
                  .map((t) => (
                    <CarHistoryMap
                      t={t}
                      setSelectedTracker={setSelectedTracker}
                    />
                  ))}
              </div>
            )}
          </div>
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
          setSelectedTracker={setSelectedTracker}
        />
      )}
    </div>
  );
};

export default SingleCar;
