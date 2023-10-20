import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  makePostRequest,
  makePutRequest,
} from "../../requests/helperFunctions";

import HistoryMap from "./HistoryMap";
import AddTimeOverlay from "./AddTimeOverlay";

import * as Excel from "exceljs";

import { saveAs } from "file-saver";

const SingleTracker = () => {
  const params = useParams();
  const nav = useNavigate();

  const [selectedTracker, setSelectedTracker] = useState(null);

  const [total, setTotal] = useState(null);

  const [showAddOverlay, setShowAddOverlay] = useState(false);

  async function clockin() {
    const c = confirm(`Clock in for ${selectedTracker.name}?`);

    if (!c) return;

    await makePutRequest("time/clockin", { id: selectedTracker.id })
      .then((res) => {
        if (res?.id) {
          setSelectedTracker(res);
        }
      })
      .catch(() => {
        alert("Something went wrong, please try again");
      });
  }

  async function clockout() {
    const c = confirm(`Clock out for ${selectedTracker.name}?`);

    if (!c) return;

    await makePutRequest("time/clockout", { id: selectedTracker.id })
      .then((res) => {
        if (res?.id) {
          setSelectedTracker(res);
        }
      })
      .catch(() => {
        alert("Something went wrong, please try again");
      });
  }

  async function exportTimeTracker() {
    if (!selectedTracker.history.length) return;

    const book = new Excel.Workbook();

    const sheet = book.addWorksheet(`${selectedTracker.name} Time History`, {
      views: [{ state: "frozen", ySplit: 1 }],
    });

    sheet.columns = [
      { header: "Start", key: "Start" },
      { header: "End", key: "End" },
      { header: "Hours", key: "Hours" },
      { header: "Memo", key: "Memo" },
    ];

    selectedTracker.history.forEach((t) => {
      const obj = {};

      obj["Start"] ||= new Date(t.timeIn).toLocaleString("en-us", {
        timeZone: "America/Chicago",
      });

      obj["End"] ||= new Date(t.timeOut).toLocaleString("en-us", {
        timeZone: "America/Chicago",
      });

      obj["Hours"] ||= (
        Math.abs(new Date(t.timeIn) - new Date(t.timeOut)) / 36e5
      ).toFixed(2);

      obj["Memo"] ||= t.memo || "";

      sheet.addRow(obj);
    });

    const buf = await book.xlsx.writeBuffer();

    saveAs(new Blob([buf]), `${selectedTracker.name}Time.xlsx`);
  }

  useEffect(() => {
    if (!selectedTracker) return;

    if (!selectedTracker.history.length) return;

    let t = 0;

    selectedTracker.history.forEach((tr) => {
      t += Math.abs(new Date(tr.timeIn) - new Date(tr.timeOut)) / 36e5;
    });

    setTotal(t);
  }, [selectedTracker]);

  useEffect(() => {
    const id = params.id;

    async function f() {
      await makePostRequest("time/getone", {
        id: id,
        auth: window.localStorage.getItem("token"),
      })
        .then((res) => {
          if (res?.id) {
            setSelectedTracker(res);
          } else {
            setSelectedTracker("unauthorized");
          }
        })
        .catch((err) => {
          alert("Something went wrong, please try again");
        });
    }

    f();
  }, []);

  if (selectedTracker == "unauthorized") {
    return (
      <div className="home-parent">
        <img className="home-logo" src="/assets/logo.jpeg" />
        <div className="home-krink">Unauthorized</div>
      </div>
    );
  }

  if (!selectedTracker) {
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

  return (
    <div className="home-parent">
      <img
        className="home-logo"
        src="/assets/logo.jpeg"
        style={{ cursor: "pointer" }}
        onClick={() => nav("/time")}
      />
      <div className="home-krink">Tracker - {selectedTracker.name}</div>

      <div className="t-co">
        <div className="t-clock t-in t-c" onClick={() => clockin()}>
          IN
        </div>

        <div className="t-clock t-out t-c" onClick={() => clockout()}>
          OUT
        </div>
      </div>
      <div className="f-s-main">
        Current clock in: {selectedTracker?.currentTimeIn || "null"}
      </div>
      <div className="pi-octoggle" style={{ marginTop: "30px" }}>
        History
        <div className="grow" />
        <div
          className="home-add home-create"
          onClick={() => setShowAddOverlay(true)}
        >
          Add
        </div>
        <div
          className="home-add home-create"
          style={{ backgroundColor: "orange", marginLeft: "15px" }}
          onClick={() => exportTimeTracker()}
        >
          Export
        </div>
      </div>

      {selectedTracker.history.length > 0 ? (
        <div>
          <table className="t-mapcon ccv-table">
            <thead>
              <tr>
                <td>Start</td>
                <td>End</td>
                <td>Hours</td>
                <td>Memo</td>
              </tr>
            </thead>
            <tbody>
              {selectedTracker.history
                .sort(function (a, b) {
                  return (
                    new Date(b.timeIn).getTime() - new Date(a.timeIn).getTime()
                  );
                })
                .map((tr) => (
                  <HistoryMap tr={tr} />
                ))}
            </tbody>
          </table>

          <div
            style={{ marginTop: "25px", textAlign: "right" }}
            className="f-s-main"
          >
            Total: {total?.toFixed(2)} Hours
          </div>
        </div>
      ) : (
        "No history"
      )}

      {showAddOverlay && (
        <AddTimeOverlay
          selectedTracker={selectedTracker}
          setSelectedTracker={setSelectedTracker}
          set={setShowAddOverlay}
        />
      )}
    </div>
  );
};

export default SingleTracker;
