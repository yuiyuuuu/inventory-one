import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { makeDeleteRequest } from "../requests/requestFunctions";

import "./qr.scss";

import CreateQROverlay from "./CreateQROverlay";
import Pen from "../item/svg/Pen";
import TrashIcon from "./svg/TrashIcon";
import EditQROverlay from "./EditQROverlay";

const QR = () => {
  const nav = useNavigate();

  const [showCreateOverlay, setShowCreateOverlay] = useState(false);

  const [showEditOverlay, setShowEditOverlay] = useState(false);
  const [selectedQR, setSelectedQR] = useState(null);

  const [userQRCodes, setUserQrCodes] = useState([]);

  const authState = useSelector((state) => state.auth);

  async function handleDeleteQR(qr) {
    const c = confirm(`Confirm delete "${qr.name}" QR?`);

    if (c) {
      await makeDeleteRequest(`/qr/deleteqr/${qr.id}`)
        .then((res) => {
          if (res.id) {
            setUserQrCodes((prev) => prev.filter((v) => v.id !== res.id));
            alert("QR Deleted");
          }
        })
        .catch(() => {
          alert("Something went wrong, please try again");
        });
    }
  }

  //edit overlay after edited handling
  function handleAfter(qr) {
    setUserQrCodes((prev) => prev.map((v) => (v.id === qr.id ? qr : v)));
  }

  useEffect(() => {
    if (!authState?.id) return;

    setUserQrCodes(authState?.QR);
  }, [authState]);

  if (authState.loading && authState.loading !== "false") {
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
      <img className="home-logo" src="/assets/logo.jpeg" />
      <div className="home-krink">Inventory QR</div>

      <div className="home-f home-lp">
        <span>Your QR Codes</span>
        <div className="grow" />
        {authState?.id && (
          <div
            className="home-add home-create"
            onClick={() => setShowCreateOverlay(true)}
          >
            Create
          </div>
        )}
      </div>

      {authState?.loading !== "loading" && !authState?.id ? (
        <div className="home-none">
          <a className="home-siredir" href="/login">
            Log in
          </a>{" "}
          to view and create QR codes
        </div>
      ) : userQRCodes.length > 0 ? (
        <div className="home-mapcontainer qr-mapcontainer">
          {userQRCodes
            .sort(function (a, b) {
              if (a.name < b.name) {
                return -1;
              }
              if (a.name > b.name) {
                return 1;
              }
              return 0;
            })
            .map((qr) => (
              <div className="home-mapch" onClick={() => nav(`/qr/${qr.id}`)}>
                <div className="ellipsis" style={{ width: "75%", flexGrow: 1 }}>
                  <div
                    className="ellipsis elli-media qr-name"
                    style={{ marginBottom: "5px" }}
                  >
                    {qr?.name}
                  </div>

                  <div
                    className="ellipsis elli-media"
                    style={{ marginBottom: "5px" }}
                  >
                    Scanned: {qr?.count}
                  </div>

                  <a
                    className="ellipsis qr-hov elli-media"
                    href={qr?.link}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {qr?.link}
                  </a>
                </div>

                <div
                  className="item-overwrite item-cli"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowEditOverlay(true);
                    setSelectedQR(qr);
                  }}
                >
                  <Pen />
                </div>

                <div
                  className="item-overwrite item-cli qr-trash"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteQR(qr);
                  }}
                >
                  <TrashIcon />
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="home-none">
          You have no QR codes.{" "}
          <span
            className="pointer underline"
            onClick={() => setShowCreateOverlay(true)}
          >
            Create
          </span>{" "}
          one.
        </div>
      )}

      {showCreateOverlay && (
        <CreateQROverlay setShowCreateOverlay={setShowCreateOverlay} />
      )}

      {showEditOverlay && (
        <EditQROverlay
          setShowEdit={setShowEditOverlay}
          selectedQR={selectedQR}
          setSelectedQr={setSelectedQR}
          after={handleAfter}
        />
      )}
    </div>
  );
};

export default QR;
