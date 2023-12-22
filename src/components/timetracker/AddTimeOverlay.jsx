import React, { useState } from "react";
import { makePostRequest } from "../../requests/helperFunctions";
import { useDispatch } from "react-redux";

const AddTimeOverlay = ({ selectedTracker, setSelectedTracker, set }) => {
  const [timeIn, setTimeIn] = useState(null);
  const [timeOut, setTimeOut] = useState(null);

  const [memo, setMemo] = useState(null);

  const [timeError, setTimeError] = useState(false);

  const [t1Error, sett1Error] = useState(false);
  const [t2Error, sett2Error] = useState(false);

  async function handleSubmit() {
    sett1Error(false);
    sett2Error(false);
    setTimeError(false);

    let bad = false;
    if (new Date(timeIn).getTime() >= new Date(timeOut).getTime()) {
      bad = true;
      setTimeError(true);
    }

    if (!timeIn) {
      bad = true;
      sett1Error(true);
    }

    if (!timeOut) {
      bad = true;
      sett2Error(true);
    }

    if (bad) return;

    await makePostRequest("time/addhistory", {
      trackerid: selectedTracker.id,
      timein: timeIn,
      timeout: timeOut,
      memo,
    })
      .then((res) => {
        if (res?.id) {
          setSelectedTracker(res);
          set(false);
          alert("Added");
        }
      })
      .catch(() => {
        alert("Something went wrong, please try again");
      });
  }

  return (
    <div className="home-createoverlay" onClick={() => set(false)}>
      <div className="homec-inner" onClick={(e) => e.stopPropagation()}>
        <div className="homec-l">Add Tracker Time</div>

        {timeError && (
          <div className="kh-error" style={{ marginTop: "10px" }}>
            Time in must be before time out
          </div>
        )}

        <div
          className="homec-inputcontainer rel"
          style={{ paddingBottom: "10px" }}
        >
          {t1Error && (
            <div className="kh-error" style={{ margin: "10px 0" }}>
              Time in required
            </div>
          )}

          <div className="f-s-main" style={{ marginBottom: "8px" }}>
            Time In
          </div>
          <input
            type="datetime-local"
            value={timeIn}
            onChange={(e) => setTimeIn(e.target.value)}
          />
        </div>

        <div
          className="homec-inputcontainer rel"
          style={{ paddingBottom: "10px" }}
        >
          {t2Error && (
            <div className="kh-error" style={{ margin: "10px" }}>
              Time out required
            </div>
          )}
          <div className="f-s-main" style={{ marginBottom: "8px" }}>
            Time Out
          </div>
          <input
            type="datetime-local"
            value={timeOut}
            onChange={(e) => setTimeOut(e.target.value)}
          />
        </div>

        <div className="homec-inputcontainer">
          <input
            className="homec-input"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="Memo (optional)"
          />
        </div>

        <div className="homec-submit homec-but " onClick={() => handleSubmit()}>
          Submit
        </div>
      </div>
    </div>
  );
};

export default AddTimeOverlay;
