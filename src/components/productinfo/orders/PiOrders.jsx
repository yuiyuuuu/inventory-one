import React, { useCallback, useEffect, useState } from "react";
import "./pio.scss";

import $ from "jquery";

import OrderChild from "./OrderChild";
import SelectDate from "./SelectDate";

const PiOrders = ({ orders, selectedDate, showOrders, setSelectedDate }) => {
  const [showSelectDate, setShowSelectDate] = useState(false);

  const clickout = useCallback(() => {
    const $target = $(event.target);

    if (
      !$target.closest("#pio-select").length &&
      !$target.closest("#pio-pelch").length &&
      $("#pio-pelch").is(":visible")
    ) {
      setShowSelectDate(false);
    }
  }, []);

  $(".pi-container").off("click", ".pi-container", clickout).click(clickout);

  useEffect(() => {
    $("#pio-pelch").css("top", $(".pio-select").outerHeight() + 9);
  }, [showSelectDate]);

  // $(window)
  //   .off("resize")
  //   .resize(() => setShowSelectDate(false));

  useEffect(() => {
    $(window).resize(() => {
      setShowSelectDate(false);
    });
  }, []);

  console.log(selectedDate);

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
          <SelectDate
            orders={orders}
            setSelectedDate={setSelectedDate}
            setShowSelectDate={setShowSelectDate}
          />
        )}
      </div>
      {orders[selectedDate]?.map((order) => (
        <OrderChild order={order} />
      ))}
    </div>
  );
};

export default PiOrders;
