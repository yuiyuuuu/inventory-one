import React from "react";
import { makePostRequest } from "../../requests/helperFunctions";

const HistoryMap = ({ tr }) => {
  return (
    <tr
      onClick={async () => {
        const c = confirm("Confirm Delete this time log?");

        if (c) {
          await makePostRequest("time/deleteone", { id: tr.id });
        }
      }}
    >
      <td>
        {new Date(tr.timeIn).toLocaleString("en-US", {
          timeZone: "America/Chicago",
        })}
      </td>

      <td>
        {new Date(tr.timeOut).toLocaleString("en-US", {
          timeZone: "America/Chicago",
        })}
      </td>
      <td>
        {(Math.abs(new Date(tr.timeIn) - new Date(tr.timeOut)) / 36e5).toFixed(
          2
        )}
      </td>

      <td>{tr?.memo || "---"}</td>
    </tr>
  );
};

export default HistoryMap;
