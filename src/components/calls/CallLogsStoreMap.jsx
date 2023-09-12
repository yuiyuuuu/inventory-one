import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CallLogsStoreMap = ({ store }) => {
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
    <div className="store-map" onClick={() => nav(`/calls/${store?.id}`)}>
      <div className="store-name">
        <div className="qr-name ellipsis" style={{ marginBottom: "5px" }}>
          {store?.name}
        </div>
        <div
          className="ellipsis elli-media"
          style={{ fontSize: "16px", marginBottom: lastCalled?.id && "5px" }}
        >
          Last Called:{" "}
          {lastCalled === "none"
            ? "None"
            : new Date(lastCalled?.createdAt).toLocaleString("en-US", {
                timeZone: "America/Chicago",
              })}
        </div>

        {lastCalled?.id && (
          <div className="ellipsis elli-media" style={{ fontSize: "16px" }}>
            Last Called By: {lastCalled.name}
          </div>
        )}
      </div>
      <div className="grow" />
      <div className="mitem-caret" style={{ transform: "rotate(-90deg)" }} />
    </div>
  );
};

export default CallLogsStoreMap;
