import React from "react";
import VisitsCustomDateSelector from "./visit-cds/VisitsCustomDateSelector";

const VisitTracker = () => {
  console.log($(".v-topcon").outerHeight());

  return (
    <div className="home-parent">
      <div className="v-topcon">
        <img className="home-logo" src="/assets/logo.jpeg" />
        <div className="home-krink">Visits Tracker</div>
      </div>
      <VisitsCustomDateSelector idv={"visit-tracker"} />
    </div>
  );
};

export default VisitTracker;
