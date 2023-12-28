import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { setErrorStatesFalse, validateForm } from "../../../store/validateForm";
import { makePostRequestWithAuth } from "../../../requests/helperFunctions";
import { getToken } from "../../../requests/getToken";
import { dispatchSetLoading } from "../../../store/global/loading";

const ReturnCarOverlay = ({ setState, state }) => {
  const dispatch = useDispatch();

  const [selectedInput, setSelectedInput] = useState(
    state.car.trackerInputs.find((t) => !t.returnTime)
  );

  const [name, setName] = useState(
    state.car.trackerInputs.find((t) => !t.returnTime).takenBy
  );

  //false = damaged/bad, true = good/not damaged
  const [oilStatus, setOilStatus] = useState(null);
  const [tireStatus, setTireStatus] = useState(null);
  const [windShieldWiperStatus, setWindShieldWiperStatus] = useState(null);
  const [bodyStatus, setBodyStatus] = useState(null);
  const [lightStatus, setLightStatus] = useState(null);

  //error states
  const [e1, setE1] = useState(false); //oil
  const [e2, setE2] = useState(false); //tire
  const [e3, setE3] = useState(false); //wind shield
  const [e4, setE4] = useState(false); //body
  const [e5, setE5] = useState(false); //light

  //other memo in case something else is broken or needs to be noted
  const [otherMemo, setOtherMemo] = useState(null);

  async function handleSubmit() {
    setErrorStatesFalse([setE1, setE2, setE3, setE4, setE5]);

    const check = validateForm([
      { value: oilStatus !== null, f: setE1 },
      { value: tireStatus !== null, f: setE2 },
      { value: windShieldWiperStatus !== null, f: setE3 },
      { value: lightStatus !== null, f: setE4 },
      { value: bodyStatus !== null, f: setE5 },
    ]);

    if (!check) return;

    dispatch(dispatchSetLoading(true));

    await makePostRequestWithAuth(
      "cars/createinput",
      {
        name,
        oilStatus,
        tireStatus,
        windShieldWiperStatus,
        lightStatus,
        bodyStatus,
        car: state.car,
        memo: otherMemo,
      },
      getToken()
    );
  }

  useEffect(() => {
    $("#car-textarea")
      .each(function () {
        this.setAttribute(
          "style",
          "height:" + this.scrollHeight + "px;overflow-y:hidden;"
        );
      })
      .on("input", function () {
        this.style.height = 0;
        this.style.height = this.scrollHeight + "px";
      });
  }, []);

  return (
    <div className="home-createoverlay" onClick={() => setState(null)}>
      <div className="homec-inner" onClick={(e) => e.stopPropagation()}>
        <div className="homec-l">Return Car - {state.car.name}</div>

        <div className="f-s-main">Name: {name}</div>

        <div className="homec-inputcontainer">
          <textarea
            className="cl-textarea"
            placeholder="Memo (optional)"
            onChange={(e) => setOtherMemo(e.target.value)}
            id="car-textarea"
          />
        </div>

        <div className="car-selcon">
          {e1 && <div className="kh-error">Select Oil Status!</div>}

          <div className="f-s-main car-choice">Oil Status</div>

          <div className="car-checkboxcon">
            <input
              type="checkbox"
              checked={oilStatus === false}
              onClick={() => setOilStatus(false)}
            />
            <label className="f-s-main">Not Damaged</label>
          </div>

          <div className="car-checkboxcon">
            <input
              type="checkbox"
              checked={oilStatus === true}
              onClick={() => setOilStatus(true)}
            />
            <label className="f-s-main">Damaged</label>
          </div>
        </div>

        <div className="car-selcon">
          {e2 && <div className="kh-error">Select Tire Status!</div>}

          <div className="f-s-main car-choice">Tire Status</div>

          <div className="car-checkboxcon">
            <input
              type="checkbox"
              checked={tireStatus === false}
              onClick={() => setTireStatus(false)}
            />
            <label className="f-s-main">Not Damaged</label>
          </div>

          <div className="car-checkboxcon">
            <input
              type="checkbox"
              checked={tireStatus === true}
              onClick={() => setTireStatus(true)}
            />
            <label className="f-s-main">Damaged</label>
          </div>
        </div>

        <div className="car-selcon">
          {e3 && <div className="kh-error">Select Wiper Status!</div>}

          <div className="f-s-main car-choice">Wind Shield Wipers Status</div>

          <div className="car-checkboxcon">
            <input
              type="checkbox"
              checked={windShieldWiperStatus === false}
              onClick={() => setWindShieldWiperStatus(false)}
            />
            <label className="f-s-main">Not Damaged</label>
          </div>

          <div className="car-checkboxcon">
            <input
              type="checkbox"
              checked={windShieldWiperStatus === true}
              onClick={() => setWindShieldWiperStatus(true)}
            />
            <label className="f-s-main">Damaged</label>
          </div>
        </div>

        <div className="car-selcon">
          {e4 && <div className="kh-error">Select Light Status!</div>}

          <div className="f-s-main car-choice">Light Status</div>

          <div className="car-checkboxcon">
            <input
              type="checkbox"
              checked={lightStatus === false}
              onClick={() => setLightStatus(false)}
            />
            <label className="f-s-main">Not Damaged</label>
          </div>

          <div className="car-checkboxcon">
            <input
              type="checkbox"
              checked={lightStatus === true}
              onClick={() => setLightStatus(true)}
            />
            <label className="f-s-main">Damaged</label>
          </div>
        </div>

        <div className="car-selcon">
          {e5 && <div className="kh-error">Select Body Status!</div>}

          <div className="f-s-main car-choice">Body Status</div>

          <div className="car-checkboxcon">
            <input
              type="checkbox"
              checked={bodyStatus === false}
              onClick={() => setBodyStatus(false)}
            />
            <label className="f-s-main">Not Damaged</label>
          </div>

          <div className="car-checkboxcon">
            <input
              type="checkbox"
              checked={bodyStatus === true}
              onClick={() => setBodyStatus(true)}
            />
            <label className="f-s-main">Damaged</label>
          </div>
        </div>

        <div className="homec-submit homec-but" onClick={() => handleSubmit()}>
          Submit
        </div>
      </div>
    </div>
  );
};

export default ReturnCarOverlay;
