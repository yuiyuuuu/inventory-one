import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const KeysChartTr = ({ store }) => {
  const nav = useNavigate();

  const [lastTaken, setLastTaken] = useState(null);

  useEffect(() => {
    if (!store?.id) return;

    const c = [];

    //for each faster than filter
    store.keyLog.forEach((log) => {
      if (!log.returnTime) {
        c.push(log);
      }
    });

    c.sort(function (a, b) {
      return new Date(b.takeTime) - new Date(a.takeTime);
    });

    if (!c.length) {
      setLastTaken("none");
    } else {
      setLastTaken(c[0]);
    }
  }, [store]);

  return (
    <tr onClick={() => nav(`/keys/k/${store?.id}`)}>
      <td style={{ maxWidth: "25%" }} className="ellipsis">
        {store?.name}
      </td>
      <td className="ellipsis" style={{ maxWidth: "25%" }}>
        {lastTaken === "none" ? "---" : lastTaken?.name}
      </td>
      <td style={{ maxWidth: "25%" }} className="ellipsis">
        {lastTaken === "none"
          ? "---"
          : new Date(lastTaken?.takeTime).toLocaleDateString("en-US", {
              timeZone: "America/Chicago",
            })}
      </td>
    </tr>
  );
};

export default KeysChartTr;
