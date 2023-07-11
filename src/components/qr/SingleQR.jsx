import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { makeGetRequest } from "../../requests/helperFunctions";
import { makeDeleteRequest } from "../requests/requestFunctions";

import EditQROverlay from "./EditQROverlay";

const SingleQR = () => {
  const params = useParams();

  const authstate = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(true);

  const [selectedQr, setSelectedQr] = useState({});

  const [showEdit, setShowEdit] = useState(false);

  const [notFound, setNotFound] = useState(false);

  async function handleDeleteQR(qr) {
    const c = confirm(`Confirm delete "${qr.name}" QR?`);

    if (c) {
      await makeDeleteRequest(`/qr/deleteqr/${qr.id}`)
        .then((res) => {
          if (res.id) {
            alert("QR Deleted");
            window.location.href = "/qr";
          }
        })
        .catch(() => {
          alert("Something went wrong, please try again");
        });
    }
  }

  useEffect(() => {
    const id = params.id;

    async function fetchQr() {
      await makeGetRequest(
        `/qr/fetch/${id}/${import.meta.env.VITE_ROUTEPASS}`
      ).then((res) => {
        if (res.id) {
          setSelectedQr(res);

          setLoading(false);
        } else {
          setLoading(false);
          setNotFound(true);
        }
      });
    }

    fetchQr();
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

  if (notFound) {
    return (
      <div className="home-parent">
        <img
          className="home-logo"
          src="/assets/logo.jpeg"
          style={{ cursor: "pointer" }}
          onClick={() => (window.location.href = `/qr`)}
        />

        <div className="home-krink">No QR Found</div>
      </div>
    );
  }

  return (
    <div className="home-parent">
      <img
        className="home-logo"
        src="/assets/logo.jpeg"
        style={{ cursor: "pointer" }}
        onClick={() => (window.location.href = `/qr`)}
      />
      <div className="home-krink">QR - {selectedQr?.name}</div>
      {authstate.loading === "false" && !authstate?.id ? (
        <div className="home-none">
          <a className="home-siredir" href="/login">
            Log in
          </a>{" "}
          to see QR codes
        </div>
      ) : (
        <div>
          <div className="qr-i">
            <img src={`${selectedQr?.image}`} id="qrimg" className="qr-img" />
          </div>
          <div className="home-f home-lp">
            Link
            <div className="grow" />
            <div className="home-add qr-edit" onClick={() => setShowEdit(true)}>
              Edit
            </div>
            <div
              className="home-add qr-edit"
              onClick={() => handleDeleteQR(selectedQr)}
              style={{ marginLeft: "15px", backgroundColor: "red" }}
            >
              Delete
            </div>
          </div>
          <div className="qr-u">
            <a
              className="ellipsis qr-hov qr-ur"
              href={selectedQr?.link}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedQr?.link}
            </a>
          </div>
        </div>
      )}
      {showEdit && (
        <EditQROverlay
          selectedQR={selectedQr}
          setShowEdit={setShowEdit}
          setSelectedQr={setSelectedQr}
        />
      )}
    </div>
  );
};

export default SingleQR;
