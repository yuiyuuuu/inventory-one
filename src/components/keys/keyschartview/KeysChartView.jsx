import React from "react";
import { useSelector } from "react-redux";

import KeysChartTr from "./KeysChartTr";

const KeysChartView = () => {
  const stores = useSelector((state) => state.allStores);

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <table className="ccv-table">
        <thead>
          <tr>
            <td>Store</td>
            <td>Current Taken By</td>

            <td>Current Taken Date</td>
          </tr>
        </thead>
        <tbody>
          {stores
            ?.slice(1)
            ?.filter((t) => t.number < 100)
            ?.map((store) => (
              <KeysChartTr store={store} />
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default KeysChartView;
