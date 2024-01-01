import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getToken } from "../../requests/getToken";
import { makePostRequestWithAuth } from "../../requests/helperFunctions";
import { dispatchSetLoading } from "../../store/global/loading";

const CarHistoryMap = ({ t, setSelectedTracker }) => {
  const dispatch = useDispatch();

  const authstate = useSelector((state) => state.auth);

  const [show, setShow] = useState(false);

  async function handleDelete() {
    const c = confirm(
      `Confirm delete car tracker input from ${new Date(
        t.returnTime
      ).toLocaleString("en-us", {
        timeZone: "America/Chicago",
      })}`
    );

    if (!c) return;

    dispatch(dispatchSetLoading(true));

    await makePostRequestWithAuth(
      "cars/deletecarinput",
      { id: t.id },
      getToken()
    )
      .then((res) => {
        if (res === "deleted") {
          setSelectedTracker((prev) => {
            return {
              ...prev,
              trackerInputs: prev.trackerInputs.filter((v) => v.id !== t.id),
            };
          });

          alert("Successfully deleted");
          dispatch(dispatchSetLoading(false));
        }
      })
      .catch((err) => {
        console.log(err);
        alert("Something went wrong, please try again");
        dispatch(dispatchSetLoading(false));
      });
  }

  useEffect(() => {
    //when id changes, we set show to false
    setShow(false);
  }, [t.id]);

  return (
    <div className='car-histch'>
      <div
        className='car-hist f-s-main pio-bbot'
        onClick={() => setShow((prev) => !prev)}
      >
        {t.takenBy} - {new Date(t.returnTime).toLocaleDateString()}
        <div className='grow' />
        {authstate.id === t.actionUserId && (
          <div
            className='home-add home-create'
            style={{ backgroundColor: "red", marginRight: "4px" }}
            onClick={() => handleDelete()}
          >
            Delete
          </div>
        )}
        <div
          className='mitem-caret'
          style={{ transform: !show && "rotate(-90deg)" }}
        />
      </div>

      {show && (
        <div>
          <div className='car-histinfo'>
            <span className='bold'>Take Time:</span>{" "}
            {new Date(t.takeTime).toLocaleString("en-us", {
              timeZone: "America/Chicago",
            })}
          </div>

          <div className='car-histinfo'>
            <span className='bold'>Return Time:</span>{" "}
            {new Date(t.returnTime).toLocaleString("en-us", {
              timeZone: "America/Chicago",
            })}
          </div>

          {t.other && (
            <div className='car-histinfo'>
              <pre>
                <span className='bold'>Memo:</span> {t.other}
              </pre>
            </div>
          )}
          <div className='car-histinfo'>
            <span className='bold'>Oil Status:</span>{" "}
            {t.oilStatus === "notdamaged" ? "Not Damged" : "Damaged"}
          </div>
          <div className='car-histinfo'>
            <span className='bold'>Tire Status:</span>{" "}
            {t.tireStatus === "notdamaged" ? "Not Damged" : "Damaged"}
          </div>
          <div className='car-histinfo'>
            <span className='bold'>Windshield Wiper Status:</span>{" "}
            {t.windShieldWipersStatus === "notdamaged"
              ? "Not Damged"
              : "Damaged"}
          </div>
          <div className='car-histinfo'>
            <span className='bold'>Car Body Status:</span>{" "}
            {t.bodyStatus === "notdamaged" ? "Not Damged" : "Damaged"}
          </div>
          <div className='car-histinfo'>
            <span className='bold'>Light Status:</span>{" "}
            {t.lightStatus === "notdamaged" ? "Not Damged" : "Damaged"}
          </div>
        </div>
      )}
    </div>
  );
};

export default CarHistoryMap;
