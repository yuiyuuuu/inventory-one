import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  makeGetRequest,
  makeGetRequestWithAuth,
} from "../../../requests/helperFunctions";
import CreateCallLogOverlay from "../CreateCallLogOverlay";
import SingleCallLogMap from "./SingleCallLogMap";
import EditCallLogOverlay from "../EditCallLogOverlay";

const SingleStoreCallLog = () => {
  const params = useParams();

  const authState = useSelector((state) => state.auth);

  const [selectedStore, setSelectedStore] = useState(null);

  const [showCreateOverlay, setShowCreateOverlay] = useState(false);
  const [showEditOverlay, setShowEditOverlay] = useState(false);
  const [editInfo, setEditInfo] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = params.storeid;

    if (!authState.id) return;

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
  }, [authState]);

  if (!authState.id && authState.loading === "false") {
    return (
      <div className="home-parent">
        <img
          className="home-logo"
          src="/assets/logo.jpeg"
          onClick={() => (window.location.href = "/calls")}
        />
        <div className="home-krink">Call Logs</div>{" "}
        <div className="home-none">
          <a className="home-siredir" href="/login">
            Log in
          </a>{" "}
          to see call logs
        </div>
      </div>
    );
  }

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
              <SingleCallLogMap
                info={log}
                setShowEdit={setShowEditOverlay}
                setEditInfo={setEditInfo}
              />
            </div>
          ))
      )}

      {showCreateOverlay && (
        <CreateCallLogOverlay
          setShow={setShowCreateOverlay}
          prefill={selectedStore}
        />
      )}

      {showEditOverlay && (
        <EditCallLogOverlay
          setShow={setShowEditOverlay}
          prefill={editInfo}
          store={selectedStore}
        />
      )}
    </div>
  );
};

export default SingleStoreCallLog;
