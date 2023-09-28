import React, { useState } from "react";

import "./emp.scss";
import ExportOverlay from "./ExportOverlay";
import { useSelector } from "react-redux";

const Employees = () => {
  const authState = useSelector((state) => state.auth);

  const [showExportOverlay, setShowExportOverlay] = useState(false);

  if (!authState.id && authState.loading === "false") {
    return (
      <div className="home-parent">
        <img className="home-logo" src="/assets/logo.jpeg" />
        <div className="home-krink">Export</div>{" "}
        <div className="home-none">
          <a className="home-siredir" href="/login">
            Log in
          </a>{" "}
          to export
        </div>
      </div>
    );
  }

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
