import React, { useEffect, useState } from "react";

import { makeGetRequestWithAuth } from "../../requests/helperFunctions";
import { getToken } from "../../requests/getToken";

import VisitsCustomDateSelector from "./visit-cds/VisitsCustomDateSelector";
import AddVisitTrackerOverlay from "./overlay/AddVisitTrackerOverlay";
import Loading from "../global/LoadingComponent";

const VisitTracker = () => {
  //all visit trackers throughout all stores
  const [visitTrackers, setVisitTrackers] = useState(null);

  const [showAddVisitOverlay, setShowAddVisitOverlay] = useState(false);

  const [visitTrackerSortedByDate, setVisitTrackerSortedByDate] =
    useState(null);

  const [visitorsSorted, setVisitorsSorted] = useState(null);

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
      const time = new Date(t.actionTime).toDateString().replace(/^\S+\s/, "");

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

  if (!visitTrackerSortedByDate || !visitorsSorted) {
    return <Loading />;
  }

  return (
    <div className="home-parent">
      <div className="v-topcon">
        <img className="home-logo" src="/assets/logo.jpeg" />
        <div className="home-krink">Visits Tracker</div>
      </div>

      <div className="flex-justcenter">
        <button
          className="home-add kh-take"
          onClick={() => setShowAddVisitOverlay(true)}
        >
          Add
        </button>
        <button
          className="home-add kh-take"
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
        <AddVisitTrackerOverlay set={setShowAddVisitOverlay} />
      )}
    </div>
  );
};

export default VisitTracker;
