import React, { useEffect, useState } from "react";
import "./pio.scss";

import $ from "jquery";

import OrderChild from "./OrderChild";

const PiOrders = ({ orders, selectedDate, showOrders, setSelectedDate }) => {
  const [showSelectDate, setShowSelectDate] = useState(false);

  useEffect(() => {
    $(".pio-selch").css("top", $(".pio-select").outerHeight() + 9);
  }, [showSelectDate]);

  return (
    <div className="pio-parent" style={{ display: !showOrders && "none" }}>
      <div className="pio-rel">
        <div
          className="pio-select"
          onClick={() => setShowSelectDate((prev) => !prev)}
          id="pio-select"
        >
          {selectedDate || "Select a date"}
          <div className="grow" />
          <div
            className="mitem-caret"
            style={{ transform: !showSelectDate && "rotate(-90deg)" }}
          />
        </div>
        {showSelectDate && (
          <div className="pio-selch" id="pelch">
            {Object.keys(orders).map((v, i) => (
              <div
                className="pio-ch"
                style={{
                  borderBottom: i === Object.keys(orders).length - 1 && "none",
                }}
                onClick={() => {
                  setShowSelectDate(false);
                  setSelectedDate(v);
                }}
              >
                {v}
              </div>
            ))}
          </div>
        )}
      </div>
      {orders[selectedDate]?.map((order) => (
        <OrderChild order={order} />
      ))}
    </div>
  );
};

export default PiOrders;
