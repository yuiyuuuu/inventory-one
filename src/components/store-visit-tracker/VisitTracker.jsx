import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { makeGetRequestWithAuth } from "../../requests/helperFunctions";
import { getToken } from "../../requests/getToken";

import VisitsCustomDateSelector from "./visit-cds/VisitsCustomDateSelector";
import AddVisitTrackerOverlay from "./overlay/AddVisitTrackerOverlay";
import Loading from "../global/LoadingComponent";
import SelectedDateOverlay from "./overlay/SelectedDateOverlay";

const VisitTracker = () => {
  const nav = useNavigate();

  //all visit trackers throughout all stores
  const [visitTrackers, setVisitTrackers] = useState(null);

  const [showAddVisitOverlay, setShowAddVisitOverlay] = useState(false);

  const [visitTrackerSortedByDate, setVisitTrackerSortedByDate] =
    useState(null);

  const [visitorsSorted, setVisitorsSorted] = useState(null);

  //if user selects a specific date on the calender
  //found using search params
  const [selectedDate, setSelectedDate] = useState(null);

  //fetch visit trackers
  useEffect(() => {
    //already fetched
    if (visitTrackers) return;

    async function f() {
      await makeGetRequestWithAuth("visit/getall", getToken()).then((res) => {
        if (res) {
          setVisitTrackers(res);
        }
      });
    }

    f();
  }, []);

  //after trackers are fetched
  useEffect(() => {
    //trackers not fetched yet
    if (!visitTrackers) return;

    const result = {};
    const visitors = [];

    visitTrackers.forEach((t) => {
      //replace remove the day of the weeks from the returned date
      //converts to utc time since that is we converted to iso string in postgres
      const time = new Date(t.actionTime)
        .toLocaleDateString("UTC", {
          timeZone: "Etc/UTC",
        })
        .replace(/^\S+\s/, "");

      result[time] ||= [];
      result[time].push(t);

      //user is new, push it to the array
      if (!visitors.map((t) => t.id).includes(t.user.id)) {
        visitors.push(t.user);
      }
    });

    setVisitTrackerSortedByDate(result);
    setVisitorsSorted(
      visitors.sort((a, b) => {
        return a.name.localeCompare(b.name);
      })
    );
  }, [visitTrackers]);

  useEffect(() => {
    const url = new URL(window.location.href);
    const search = new URLSearchParams(url.search).get("sel");

    //no selected date, set it to null
    if (!search) {
      setSelectedDate(null);
      return;
    }

    if (Object.prototype.toString.call(new Date(search)) === "[object Date]") {
      const date = new Date(search).toLocaleDateString("UTC", {
        timeZone: "Etc/UTC",
      });

      setSelectedDate(date);
    }
  }, [window.location.href]);

  if (!visitTrackerSortedByDate || !visitorsSorted) {
    return <Loading />;
  }

  return (
    <div className='home-parent'>
      <div className='v-topcon'>
        <img className='home-logo' src='/assets/logo.jpeg' />
        <div className='home-krink'>Visits Tracker</div>
      </div>

      <div className='flex-justcenter'>
        <button
          className='home-add kh-take'
          onClick={() => setShowAddVisitOverlay(true)}
        >
          Add
        </button>
        <button
          className='home-add kh-take'
          style={{ backgroundColor: "orange", marginLeft: "10px" }}
        >
          Switch View
        </button>
      </div>
      <VisitsCustomDateSelector
        idv={"visit-tracker"}
        trackersSorted={visitTrackerSortedByDate}
        visitorsSorted={visitorsSorted}
      />

      {showAddVisitOverlay && (
        <AddVisitTrackerOverlay
          set={setShowAddVisitOverlay}
          setVisit={setVisitTrackerSortedByDate}
        />
      )}

      {selectedDate && (
        <SelectedDateOverlay
          set={() => nav("/visit")}
          selectedTrackers={visitTrackerSortedByDate[selectedDate]}
        />
      )}
    </div>
  );
};

export default VisitTracker;
