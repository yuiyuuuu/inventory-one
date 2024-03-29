import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CallChartTr = ({ store }) => {
  const nav = useNavigate();

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
    <tr onClick={() => nav(`/calls/${store?.id}`)}>
      <td style={{ maxWidth: "25%" }} className="ellipsis">
        {store?.name}
      </td>
      <td className="ellipsis" style={{ maxWidth: "25%" }}>
        {lastCalled === "none" ? "---" : lastCalled?.title}
      </td>
      <td style={{ maxWidth: "25%" }} className="ellipsis">
        {lastCalled === "none" ? "---" : lastCalled?.name}
      </td>
      <td style={{ maxWidth: "25%" }} className="ellipsis">
        {lastCalled === "none"
          ? "---"
          : new Date(lastCalled?.createdAt).toLocaleDateString("en-US", {
              timeZone: "America/Chicago",
            })}
      </td>
    </tr>
  );
};

export default CallChartTr;
