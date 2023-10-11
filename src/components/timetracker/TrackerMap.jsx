import React from "react";

import { useNavigate } from "react-router";

import {
  makeDeleteRequest,
  makePutRequest,
} from "../../requests/helperFunctions";

import TrashIcon from "../qr/svg/TrashIcon";

const TrackerMap = ({ tracker, setTrackers }) => {
  const nav = useNavigate();

  async function clockin() {
    const c = confirm(`Clock in for ${tracker.name}?`);

    if (!c) return;

    await makePutRequest("time/clockin", { id: tracker.id }).then((res) => {
      setTrackers((prev) => prev.map((t) => (t.id === res.id ? res : t)));
    });
  }

  async function clockout() {
    const c = confirm(`Clock out for ${tracker.name}?`);

    if (!c) return;

    await makePutRequest("time/clockout", { id: tracker.id }).then((res) => {
      console.log(res, "res");
      setTrackers((prev) => prev.map((t) => (t.id === res.id ? res : t)));
    });
  }

  async function deleteTracker() {
    const c = confirm(`Confirm delet for tracker ${tracker.name}`);

    if (!c) return;

    await makeDeleteRequest(`time/delete/${tracker.id}`).then((res) => {
      if (res === "deleted") {
        alert("Deleted");
        setTrackers((prev) => prev.filter((t) => t.id !== tracker.id));
      }
    });
  }

  return (
    <div className="home-mapch" onClick={() => nav(`/time/${tracker.id}`)}>
      <div className="ellipsis" style={{ width: "75%", flexGrow: 1 }}>
        <span style={{ fontWeight: "500" }}>{tracker.name}</span>

        <div style={{ marginTop: "5px" }}>
          Current clock in:{" "}
          {tracker.currentTimeIn
            ? new Date(tracker.currentTimeIn).toLocaleString("en-US", {
                timeZone: "America/Chicago",
              })
            : "null"}
        </div>
      </div>

      <div
        className="t-clock t-in"
        style={{ marginRight: "15px" }}
        onClick={(e) => {
          e.stopPropagation();
          clockin();
        }}
      >
        IN
      </div>
      <div
        className="t-clock t-out"
        style={{ marginRight: "10px" }}
        onClick={(e) => {
          e.stopPropagation();
          clockout();
        }}
      >
        OUT
      </div>

      <div
        className="item-overwrite item-cli qr-trash"
        onClick={(e) => {
          e.stopPropagation();
          deleteTracker();
        }}
      >
        <TrashIcon />
      </div>
    </div>
  );
};

export default TrackerMap;
