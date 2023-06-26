import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import "./cds.scss";

import $ from "jquery";

import {
  format,
  add,
  eachDayOfInterval,
  startOfWeek,
  startOfMonth,
  endOfWeek,
  endOfMonth,
  isSameMonth,
  isSameDay,
} from "date-fns";

const CustomDateSelector = () => {
  const datePickerState = useSelector((state) => state.datePicker);

  //current date will be todays date for now, but later on will be the selected date
  const [currentDate, setCurrentDate] = useState(new Date());

  console.log(currentDate);

  //format month and set the text
  useEffect(() => {
    const formatDate = format(currentDate, "MMMM - yyyy");
    $(".cds-currentmonth").html(formatDate);
  }, [currentDate]);

  useEffect(() => {
    const cdsDays = document.querySelectorAll(".cds-date");

    let days = [];

    days = eachDayOfInterval({
      start: startOfWeek(startOfMonth(currentDate)),
      end: endOfWeek(endOfMonth(currentDate)),
    });

    console.log(days);

    for (let i = 0; i < days.length; i++) {
      cdsDays[i].innerHTML = format(days[i], "d");
    }
  }, []);

  return (
    <div className='cds-parent'>
      <div className='cds-prev'>
        <div className='cds-arrow'>←</div>
        <div className='cds-currentmonth'></div>
        <div className='cds-arrow'>→</div>
      </div>
      <div className='cds-grid'>
        <div className='cds-day'>Sun</div>
        <div className='cds-day'>Mon</div>
        <div className='cds-day'>Tue</div>
        <div className='cds-day'>Wed</div>
        <div className='cds-day'>Thu</div>
        <div className='cds-day'>Fri</div>
        <div className='cds-day'>Sat</div>
      </div>

      <div className='cds-grid'>
        <div className='cds-date'></div>
        <div className='cds-date'></div>
        <div className='cds-date'></div>
        <div className='cds-date'></div>
        <div className='cds-date'></div>
        <div className='cds-date'></div>
        <div className='cds-date'></div>
        <div className='cds-date'></div>
        <div className='cds-date'></div>
        <div className='cds-date'></div>
        <div className='cds-date'></div>
        <div className='cds-date'></div>
        <div className='cds-date'></div>
        <div className='cds-date'></div>
        <div className='cds-date'></div>
        <div className='cds-date'></div>
        <div className='cds-date'></div>
        <div className='cds-date'></div>
        <div className='cds-date'></div>
        <div className='cds-date'></div>
        <div className='cds-date'></div>
        <div className='cds-date'></div>
        <div className='cds-date'></div>
        <div className='cds-date'></div>
        <div className='cds-date'></div>
        <div className='cds-date'></div>
        <div className='cds-date'></div>
        <div className='cds-date'></div>
        <div className='cds-date'></div>
        <div className='cds-date'></div>
        <div className='cds-date'></div>
        <div className='cds-date'></div>
        <div className='cds-date'></div>
        <div className='cds-date'></div>
        <div className='cds-date'></div>
      </div>
    </div>
  );
};

export default CustomDateSelector;
