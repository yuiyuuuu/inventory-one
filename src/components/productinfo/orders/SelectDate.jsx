import React from "react";

const SelectDate = ({ orders, setSelectedDate, setShowSelectDate }) => {
  return (
    <div className="pio-selch" id="pio-pelch">
      {Object.keys(orders)
        .sort(function (a, b) {
          const adate = new Date(a);
          const bdate = new Date(b);

          if (adate < bdate) return -1;
          if (adate > bdate) return 1;
          return 0;
        })
        .map((v, i) => (
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
  );
};

export default SelectDate;
