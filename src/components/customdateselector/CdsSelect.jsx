import React, { useState } from "react";
import { useCallback } from "react";
import { clickout } from "../../requests/clickout";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const CdsSelect = ({ cur, setShowSelectYear, setCurrentDate, idv }) => {
  const [show, setShow] = useState(false);

  const c = useCallback(() => {
    clickout(
      [`cds-selyr-${cur}-${idv}`, `cds-selmonth-${cur}-${idv}`],
      `cds-selmonth-${cur}-${idv}`,
      setShow,
      false
    );
  }, []);

  $(".cds-yearselect").unbind("click", c).click(c);

  return (
    <div
      className='cds-yr'
      onClick={() => setShow((prev) => !prev)}
      id={`cds-selyr-${cur}-${idv}`}
    >
      {cur}

      {show && (
        <div
          className='cds-selmonth'
          onClick={(e) => e.stopPropagation()}
          id={`cds-selmonth-${cur}-${idv}`}
        >
          {months.map((v) => (
            <div
              className='cds-m'
              onClick={() => {
                setCurrentDate(new Date(`${v}/1/${cur}`));
                setShowSelectYear(false);
              }}
            >
              {v}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CdsSelect;
