import React, { useEffect, useState } from "react";

const CallLogsStoreMap = ({ store }) => {
  const [lastCalled, setLastCalled] = useState(null);

  useEffect(() => {
    if (store?.callLog?.length < 1) {
      setLastCalled("none");
    }
  }, []);

  return (
    <div className='store-map' onClick={() => nav(`/keys/${store?.id}`)}>
      <div className='store-name'>
        <div className='qr-name ellipsis' style={{ marginBottom: "5px" }}>
          {store?.name}
        </div>
        <div className='ellipsis elli-media' style={{ fontSize: "16px" }}>
          Last Called: {lastCalled === "none" ? "None" : lastCalled}
        </div>
      </div>
      <div className='grow' />
      <div className='mitem-caret' style={{ transform: "rotate(-90deg)" }} />
    </div>
  );
};

export default CallLogsStoreMap;
