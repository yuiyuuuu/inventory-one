import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { makeGetRequest } from "../../requests/requestFunctions";

import TakeKeyOverlay from "./TakeKeyOverlay";
import KeyLogMap from "./KeyLogMap";
import KeyLogMapArchived from "./KeyLongMapArchived";

const SingleKey = () => {
  const params = useParams();

  const [selectedStore, setSelectedStore] = useState({});

  const [noStore, setNoStore] = useState({ loading: true, notfound: false });

  const [showTakeOverlay, setShowTakeOverlay] = useState(false);

  const [showActiveKeylogs, setShowActiveKeylogs] = useState(true);
  const [showArchivedKeylogs, setShowArchivedKeylogs] = useState(false);

  console.log(selectedStore?.keyLog?.filter((v) => v.returnTime).length);

  useEffect(() => {
    const id = params.id;

    async function fetch() {
      const store = await makeGetRequest(`/stores/fetch/${id}`)
        .then((res) => {
          console.log(res);

          if (res.id) {
            setSelectedStore(res);
            setNoStore({ loading: false, notfound: false });
          } else {
            setNoStore({ loading: false, notfound: true });
          }
        })
        .catch(() => {
          alert("Something went wrong, please refresh");
        });
    }

    fetch();
  }, []);

  if (noStore.loading) {
    return (
      <div className="home-parent">
        <img className="home-logo" src="/assets/logo.jpeg" />
        <div className="home-krink">Loading</div>
      </div>
    );
  }

  if (!noStore.loading && noStore.notfound) {
    return (
      <div className="home-parent">
        <img className="home-logo" src="/assets/logo.jpeg" />
        <div className="home-krink">No Store Found</div>
      </div>
    );
  }

  return (
    <div className="home-parent">
      <img className="home-logo" src="/assets/logo.jpeg" />
      <div className="home-krink">{selectedStore?.name} - Keys</div>

      <div className="home-t home-q">
        <button
          className="home-add kh-take"
          onClick={() => setShowTakeOverlay(true)}
        >
          Take Key
        </button>
      </div>

      <div
        className="pi-octoggle"
        style={{ marginTop: "30px" }}
        onClick={() => setShowActiveKeylogs((prev) => !prev)}
      >
        Active Key Logs
        <div className="grow" />
        <div
          className="mitem-caret"
          style={{ transform: !showActiveKeylogs && "rotate(-90deg)" }}
        />
      </div>

      {selectedStore?.keyLog.filter((v) => !v.returnTime).length > 0 ? (
        <div
          className="kh-keylogmap"
          style={{
            maxHeight: showActiveKeylogs
              ? selectedStore?.keyLog.filter((v) => !v.returnTime).length *
                  150 +
                40 +
                "px"
              : 0,
          }}
        >
          {selectedStore?.keyLog
            .filter((v) => !v.returnTime)
            .map((keylog) => (
              <KeyLogMap keylog={keylog} setSelectedStore={setSelectedStore} />
            ))}
        </div>
      ) : (
        <div
          style={{
            maxHeight: showActiveKeylogs ? "35px" : 0,
            padding: 0,
          }}
          className="kh-keylogmap"
        >
          No Active Keylogs for this store
        </div>
      )}

      <div
        className="pi-octoggle"
        style={{ marginTop: "30px" }}
        onClick={() => setShowArchivedKeylogs((prev) => !prev)}
      >
        Archived Key Logs
        <div className="grow" />
        <div
          className="mitem-caret"
          style={{ transform: !showArchivedKeylogs && "rotate(-90deg)" }}
        />
      </div>

      {selectedStore?.keyLog.filter((v) => v.returnTime).length > 0 ? (
        <div
          className="kh-keylogmap"
          style={{
            maxHeight: showArchivedKeylogs
              ? selectedStore?.keyLog.filter((v) => v.returnTime).length * 150 +
                40 +
                "px"
              : 0,
          }}
        >
          {selectedStore?.keyLog
            .filter((v) => v.returnTime)
            .map((keylog) => (
              <KeyLogMapArchived keylog={keylog} />
            ))}
        </div>
      ) : (
        <div
          style={{
            maxHeight: showArchivedKeylogs ? "35px" : 0,
            padding: 0,
          }}
          className="kh-keylogmap"
        >
          No Archived Keylogs for this store
        </div>
      )}

      {showTakeOverlay && (
        <TakeKeyOverlay
          setShowTakeOverlay={setShowTakeOverlay}
          selectedStore={selectedStore}
          setSelectedStore={setSelectedStore}
        />
      )}
    </div>
  );
};

export default SingleKey;
