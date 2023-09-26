import React, { useState } from "react";

import "./emp.scss";
import ExportOverlay from "./ExportOverlay";

const Employees = () => {
  const [showExportOverlay, setShowExportOverlay] = useState(false);

  return (
    <div className="home-parent">
      <img className="home-logo" src="/assets/logo.jpeg" />
      <div className="home-krink">Employee Export</div>

      <div className="home-t home-q">
        <button
          className="home-add kh-take"
          style={{ backgroundColor: "orange" }}
          onClick={() => setShowExportOverlay(true)}
        >
          Export
        </button>
      </div>

      {showExportOverlay && <ExportOverlay set={setShowExportOverlay} />}
    </div>
  );
};

export default Employees;
