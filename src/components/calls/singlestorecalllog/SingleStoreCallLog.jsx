import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  makeGetRequest,
  makeGetRequestWithAuth,
} from "../../../requests/helperFunctions";
import CreateCallLogOverlay from "../CreateCallLogOverlay";
import SingleCallLogMap from "./SingleCallLogMap";

const SingleStoreCallLog = () => {
  const params = useParams();
  const [selectedStore, setSelectedStore] = useState(null);

  const [showCreateOverlay, setShowCreateOverlay] = useState(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = params.storeid;

    async function f() {
      await makeGetRequestWithAuth(
        `stores/fetch/${id}`,
        import.meta.env.VITE_ROUTEPASS
      )
        .then((res) => {
          if (res === "not found") {
            setSelectedStore("not found");
            setLoading(false);
          } else {
            setSelectedStore(res);
            setLoading(false);
          }
        })
        .catch(() => {
          alert("Something went wrong, please refresh page");
        });
    }

    f();
  }, []);

  if (loading) {
    return (
      <div className="abs-loading2">
        <div className="lds-ring" id="spinner-form">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );
  }

  if (selectedStore === "not found") {
    return (
      <div className="home-parent">
        <img
          className="home-logo"
          src="/assets/logo.jpeg"
          onClick={() => (window.location.href = "/calls")}
          style={{ cursor: "pointer" }}
        />
        <div className="home-krink">Store not found</div>
      </div>
    );
  }

  return (
    <div className="home-parent">
      <img
        className="home-logo"
        src="/assets/logo.jpeg"
        onClick={() => (window.location.href = "/calls")}
        style={{ cursor: "pointer" }}
      />
      <div className="home-krink">Calls - {selectedStore?.name}</div>

      <div className="home-t home-q">
        <button
          className="home-add kh-take"
          onClick={() => setShowCreateOverlay(true)}
        >
          Create
        </button>
      </div>

      <div
        className="pi-octoggle"
        style={{ marginTop: "30px" }}
        onClick={() => setShowCallLogs((prev) => !prev)}
      >
        Call Logs
      </div>

      {selectedStore && selectedStore?.callLog?.length < 1 ? (
        <div style={{ marginTop: "10px" }}>This store has no call logs</div>
      ) : (
        selectedStore?.callLog
          ?.sort(function (a, b) {
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          })
          ?.map((log) => (
            <div>
              <SingleCallLogMap info={log} />
            </div>
          ))
      )}

      {showCreateOverlay && (
        <CreateCallLogOverlay
          setShow={setShowCreateOverlay}
          prefill={selectedStore}
        />
      )}
    </div>
  );
};

export default SingleStoreCallLog;
