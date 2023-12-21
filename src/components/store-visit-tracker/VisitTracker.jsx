import React, { useState } from "react";

import VisitsCustomDateSelector from "./visit-cds/VisitsCustomDateSelector";
import AddVisitTrackerOverlay from "./overlay/AddVisitTrackerOverlay";

const VisitTracker = () => {
  console.log($(".v-topcon").outerHeight());

  const [showAddVisitOverlay, setShowAddVisitOverlay] = useState(false);

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
      <VisitsCustomDateSelector idv={"visit-tracker"} />

      {showAddVisitOverlay && (
        <AddVisitTrackerOverlay set={setShowAddVisitOverlay} />
      )}
    </div>
  );
};

export default VisitTracker;
