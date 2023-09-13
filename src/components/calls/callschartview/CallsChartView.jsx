import React from "react";

import "./ccv.scss";
import CallChartTr from "./CallChartTr";

const CallsChartView = ({ store }) => {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <table className="ccv-table">
        <thead>
          <tr>
            <td>Store</td>
            <td>Subject</td>

            <td>Name</td>

            <td>Date</td>
          </tr>
        </thead>
        <tbody>
          {store?.slice(1)?.map((store) => (
            <CallChartTr store={store} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CallsChartView;
