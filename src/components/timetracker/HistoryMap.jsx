import React from "react";

const HistoryMap = ({ tr }) => {
  return (
    <tr>
      <td>{new Date(tr.timeIn).toLocaleString("en-US")}</td>

      <td>{new Date(tr.timeOut).toLocaleString("en-US")}</td>
      <td>
        {(Math.abs(new Date(tr.timeIn) - new Date(tr.timeOut)) / 36e5).toFixed(
          2
        )}
      </td>
    </tr>
  );
};

export default HistoryMap;