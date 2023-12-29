import React, { useState } from "react";

const CarHistoryMap = ({ t }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="car-histch">
      <div
        className="car-hist f-s-main pio-bbot"
        onClick={() => setShow((prev) => !prev)}
      >
        {t.takenBy} -{" "}
        {new Date(t.returnTime).toLocaleString("en-us", {
          timeZone: "America/Chicago",
        })}
        <div className="grow" />
        <div
          className="mitem-caret"
          style={{ transform: !show && "rotate(-90deg)" }}
        />
      </div>

      {show && (
        <div>
          {t.other && (
            <div className="car-histinfo">
              <pre>
                <span className="bold">Memo:</span> {t.other}
              </pre>
            </div>
          )}
          <div className="car-histinfo">
            <span className="bold">Oil Status:</span>{" "}
            {t.oilStatus === "notdamaged" ? "Not Damged" : "Damaged"}
          </div>

          <div className="car-histinfo">
            <span className="bold">Tire Status:</span>{" "}
            {t.tireStatus === "notdamaged" ? "Not Damged" : "Damaged"}
          </div>

          <div className="car-histinfo">
            <span className="bold">Windshield Wiper Status:</span>{" "}
            {t.windShieldWipersStatus === "notdamaged"
              ? "Not Damged"
              : "Damaged"}
          </div>

          <div className="car-histinfo">
            <span className="bold">Car Body Status:</span>{" "}
            {t.bodyStatus === "notdamaged" ? "Not Damged" : "Damaged"}
          </div>

          <div className="car-histinfo">
            <span className="bold">Light Status:</span>{" "}
            {t.lightStatus === "notdamaged" ? "Not Damged" : "Damaged"}
          </div>
        </div>
      )}
    </div>
  );
};

export default CarHistoryMap;
