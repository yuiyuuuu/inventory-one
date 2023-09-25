import React, { useState } from "react";

import "./emp.scss";
import ExportOverlay from "./ExportOverlay";

const Employees = () => {
  const [showExportOverlay, setShowExportOverlay] = useState(false);

  function handleExportExcel() {
    const c = [...allProducts];

    const re = [];

    c.forEach((v) => {
      //prevents mutation to the allproducts array
      re.push({
        name: v.name,
        quantity: v.quantity,
        units: v.units || "pieces",
      });
    });

    const sheet = utils.json_to_sheet(re);
    const newBook = utils.book_new();
    utils.book_append_sheet(newBook, sheet, "Data");

    writeFileXLSX(newBook, "SheetJSReactAoO.xlsx");
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
