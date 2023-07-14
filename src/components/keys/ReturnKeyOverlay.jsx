import React, { useEffect, useState } from "react";
import { makeGetRequest } from "../requests/requestFunctions";

const ReturnKeyOverlay = ({ setShowReturnOverlay }) => {
  const [activeKeyLogs, setActiveKeyLogs] = useState([]);

  const [sortedLogs, setSortedLogs] = useState({});

  useEffect(() => {
    async function fetch() {
      const c = await makeGetRequest(
        `keys/fetch/active/${import.meta.env.VITE_ROUTEPASS}`
      ).then((res) => {
        if (res.length > 0) {
          setActiveKeyLogs(res);
        }
      });
    }

    fetch();
  }, []);

  useEffect(() => {
    if (activeKeyLogs.length < 1) return;

    const result = {};

    activeKeyLogs.forEach((log) => {
      result[log.store.name] ||= [];

      result[log.store.name].push(log);
    });

    setSortedLogs(result);
  }, [activeKeyLogs]);

  console.log(sortedLogs);

  return (
    <div
      className="home-createoverlay"
      onClick={() => setShowReturnOverlay(false)}
    >
      <div className="homec-inner" onClick={(e) => e.stopPropagation()}>
        <div className="homec-l">Return Key</div>
      </div>
    </div>
  );
};

export default ReturnKeyOverlay;
