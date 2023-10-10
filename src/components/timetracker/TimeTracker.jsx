import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import "./t.scss";

import TrackerMap from "./TrackerMap";
import AddTrackerOverlay from "./AddTrackerOverlay";

const TimeTracker = () => {
  const authstate = useSelector((state) => state.auth);
  console.log(authstate);

  const [trackers, setTrackers] = useState(authstate.TimeTracker);

  const [showAddOverlay, setShowAddOverlay] = useState(false);

  // useEffect(() => {
  //   if (!authstate.id) return;

  //   setTrackers(authstate.TimeTracker)
  // }, [authstate]);

  if (authstate.loading === "false" && !authstate.id) {
    return (
      <div className="home-parent">
        <img className="home-logo" src="/assets/logo.jpeg" />
        <div className="home-krink">Export</div>{" "}
        <div className="home-none">
          <a className="home-siredir" href="/login">
            Log in
          </a>
          to export
        </div>
      </div>
    );
  }

  return (
    <div className="home-parent">
      <img className="home-logo" src="/assets/logo.jpeg" />
      <div className="home-krink">Time Tracker</div>

      <div className="home-f home-lp">
        <span>Your Trackers</span>
        <div className="grow" />

        <div
          className="home-add home-create"
          onClick={() => setShowAddOverlay(true)}
        >
          Create
        </div>
      </div>

      <div className="home-mapcontainer">
        {trackers.length > 0
          ? trackers
              ?.sort(function (a, b) {
                return a.name.localeCompare(b.name);
              })
              ?.map((tr) => (
                <TrackerMap tracker={tr} setTrackers={setTrackers} />
              ))
          : "You have no active trackers"}
      </div>

      {showAddOverlay && <AddTrackerOverlay set={setShowAddOverlay} />}
    </div>
  );
};

export default TimeTracker;
