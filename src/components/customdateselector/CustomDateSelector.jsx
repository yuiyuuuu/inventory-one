import React, { useEffect, useState } from "react";

import { useCallback } from "react";
import { clickout } from "../../requests/clickout";

import $ from "jquery";

import {
  format,
  add,
  eachDayOfInterval,
  startOfWeek,
  startOfMonth,
  endOfWeek,
  endOfMonth,
} from "date-fns";

import CdsSelect from "./CdsSelect";

const CustomDateSelector = ({
  selectedDate,
  setFunction,
  idv,
  zIndex,
  setDisplay,
}) => {
  const [showSelectYear, setShowSelectYear] = useState(false);

  //current date will be todays date for now, but later on will be the selected date
  const [currentDate, setCurrentDate] = useState(
    selectedDate ? new Date(selectedDate) : new Date()
  );

  const [allDaysofThisMonth, setAllDaysofThisMonth] = useState(null);

  function addDate() {
    const a = add(currentDate, { months: 1 });
    setCurrentDate(a);
  }

  function subtractDate() {
    const a = add(currentDate, { months: -1 });

    setCurrentDate(a);
  }

  function setValue(day, index) {
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();

    //get all the dates current on display
    const ch = [...$(`.cds-grid-${idv}`).children()].map((t) =>
      Number(t.innerHTML)
    );

    //index < indexOfPreviousMonth means it was previous month
    const indexOfPreviousMonth = ch.indexOf(1);

    //get the last day of this current month
    const lastDayOfMonth = new Date(year, month + 1, 0).getDate();

    const lenBefore = ch.slice(0, indexOfPreviousMonth).length;

    const indexOfNextMonth = ch
      .slice(indexOfPreviousMonth)
      .indexOf(lastDayOfMonth);

    const date = new Date(
      `${
        index < indexOfPreviousMonth
          ? month === 0
            ? 12
            : month
          : index > indexOfNextMonth + lenBefore
          ? month === 11
            ? //if its december we have to go to the next year janurary.
              //e.g - cur date is december 2023. We click next month's date. it will go to 01/2024
              1
            : month + 2
          : month + 1
      }/${day}/${
        month === 11
          ? index > indexOfNextMonth + lenBefore
            ? year + 1
            : year
          : month === 0
          ? //if january, and we selected previous month, then we need to go to the deceomber of the year before
            index < indexOfPreviousMonth
            ? year - 1
            : year
          : year
      }`
    );

    return date;
  }

  //format month and set the text
  useEffect(() => {
    //will not be able to find element if all days of this month is null
    if (!allDaysofThisMonth) return;

    const formatDate = format(currentDate, "MMMM - yyyy");
    $(`.cds-currentmonth-${idv}`).html(formatDate);
  }, [currentDate, allDaysofThisMonth]);

  useEffect(() => {
    let days = [];

    days = eachDayOfInterval({
      start: startOfWeek(startOfMonth(currentDate)),
      end: endOfWeek(endOfMonth(currentDate)),
    });

    setAllDaysofThisMonth(days);
  }, [currentDate]);

  useEffect(() => {
    if (!allDaysofThisMonth) return;

    const cdsDays = document.querySelectorAll(`.cds-date-${idv}`);

    for (let i = 0; i < allDaysofThisMonth.length; i++) {
      if (!allDaysofThisMonth[i]) continue;
      cdsDays[i].innerHTML = format(allDaysofThisMonth[i], "d");

      cdsDays[i].dataset.date = new Date(
        allDaysofThisMonth[i]
      ).toLocaleDateString("en-US", {
        timeZone: "America/Chicago",
      });
    }
  }, [allDaysofThisMonth]);

  useEffect(() => {
    if (!showSelectYear) return;

    // if (!$(`#cds-selyr-${new Date(currentDate).getFullYear()}`)) {
    //   return;
    // }

    //find the element of the year and scroll to it so user doesnt have to scroll all the way down
    const find = $(
      `#cds-selyr-${new Date(currentDate).getFullYear()}-${idv}`
    ).outerHeight();

    if (!find && find !== 0) {
      return;
    }

    //take the total # of years and the height of each year elemnt
    //scroll to that position when user wants to select a year
    $(".cds-yearselect").scrollTop(
      find * Math.abs(2050 - new Date(currentDate).getFullYear() - 80)
    );
  }, [showSelectYear]);

  const c = useCallback(() => {
    clickout([`cds-${idv || "m"}`], `cds-${idv || "m"}`, setDisplay, false);
  }, []);

  $(document).unbind("click", c).click(c);

  if (!allDaysofThisMonth) return;

  return (
    <div>
      <div id={`cds-${idv || "m"}`}>
        {!showSelectYear ? (
          <div
            className={`cds-parent-${idv} cds-parent`}
            style={{ zIndex: zIndex && zIndex }}
          >
            <div className='cds-prev'>
              <div className='cds-arrow' onClick={() => subtractDate()}>
                ←
              </div>
              <div
                className='flexa pointer'
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSelectYear((prev) => !prev);
                }}
              >
                <div className={`cds-currentmonth-${idv}`}></div>
                <div
                  className='mitem-caret-small'
                  style={{ marginLeft: "2.5px" }}
                />
              </div>
              <div className='cds-arrow' onClick={() => addDate()}>
                →
              </div>
            </div>
            <div className={`cds-grid`}>
              <div className={`cds-day cds-day-${idv}`}>Sun</div>
              <div className={`cds-day cds-day-${idv}`}>Mon</div>
              <div className={`cds-day cds-day-${idv}`}>Tue</div>
              <div className={`cds-day cds-day-${idv}`}>Wed</div>
              <div className={`cds-day cds-day-${idv}`}>Thu</div>
              <div className={`cds-day cds-day-${idv}`}>Fri</div>
              <div className={`cds-day cds-day-${idv}`}>Sat</div>
            </div>

            <div className={`cds-grid-${idv} cds-grid`}>
              {/* {Array(allDaysofThisMonth.length)
          .fill("") */}
              {allDaysofThisMonth.map((t, i) => (
                <div
                  className={`cds-date cds-date-${idv} ${
                    new Date(t).toLocaleDateString("en-US", {
                      timeZone: "America/Chicago",
                    }) ===
                    new Date(selectedDate).toLocaleDateString("en-US", {
                      timeZone: "America/Chicago",
                    })
                      ? "cds-date-active"
                      : ""
                  }`}
                  onClick={(e) => {
                    const c = setValue($(e.target).html(), i);
                    setFunction(c);
                    setDisplay(false);
                  }}
                ></div>
              ))}
            </div>

            <div className='cds-opt'>
              <div
                className='cds-opt-ch'
                onClick={() => {
                  setFunction(null);
                  setDisplay(false);
                }}
              >
                Clear
              </div>
              <div className='grow' />
              <div
                className='cds-opt-ch'
                onClick={() => {
                  setFunction(new Date());
                  setDisplay(false);
                }}
              >
                Today
              </div>
            </div>
          </div>
        ) : (
          <div className='cds-yearselect'>
            {[
              ...Array.from(Array(2050 - 1970).keys()).map((t) => t + 1970),
            ].map((t) => (
              <CdsSelect
                cur={t}
                setCurrentDate={setCurrentDate}
                setShowSelectYear={setShowSelectYear}
                idv={idv}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomDateSelector;
