import React, { useState, useEffect } from "react";

const CallChartTr = ({ store }) => {
  const [lastCalled, setLastCalled] = useState(null);

  useEffect(() => {
    if (!store.id) return;

    if (store?.callLog?.length < 1) {
      setLastCalled("none");
    } else {
      const recent = store.callLog.sort(function (a, b) {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      })[0];

      setLastCalled(recent);
    }
  }, [store]);

  return (
    <tr>
      <td style={{ width: "20%" }}>{store?.name}</td>
      <td>{lastCalled === "none" ? "None" : lastCalled?.title}</td>
      <td>{lastCalled === "none" ? "None" : lastCalled?.name}</td>
      <td>
        {lastCalled === "none"
          ? "None"
          : new Date(lastCalled?.createdAt).toLocaleDateString("en-US", {
              timeZone: "America/Chicago",
            })}
      </td>
    </tr>
  );
};

export default CallChartTr;
