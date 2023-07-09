import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

import CreateQROverlay from "./CreateQROverlay";

import "./qr.scss";

const QR = () => {
  const nav = useNavigate();

  const [showCreateOverlay, setShowCreateOverlay] = useState(false);

  const [userQRCodes, setUserQrCodes] = useState([]);

  const authState = useSelector((state) => state.auth);

  useEffect(() => {
    if (!authState?.id) return;

    console.log(authState);

    //add qr codes to state here later
  }, [authState]);

  if (authState.loading && authState.loading !== "false") {
    return (
      <div className='abs-loading'>
        <div className='lds-ring' id='spinner-form'>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );
  }

  return (
    <div className='home-parent'>
      <img className='home-logo' src='/assets/logo.jpeg' />
      <div className='home-krink'>Inventory QR</div>

      <div className='home-f home-lp'>
        <span>Your QR Codes</span>
        <div className='grow' />
        {authState?.id && (
          <div
            className='home-add home-create'
            onClick={() => setShowCreateOverlay(true)}
          >
            Create
          </div>
        )}
      </div>

      {authState?.loading !== "loading" && !authState?.id ? (
        <div className='home-none'>
          <a className='home-siredir' href='/login'>
            Log in
          </a>{" "}
          to view and create QR codes
        </div>
      ) : (
        <div className='home-mapcontainer'>
          {authState?.QR?.map((qr) => (
            <div className='home-mapch' onClick={() => nav(`/qr/${qr.id}`)}>
              <div className='ellipsis' style={{ maxWidth: "90%" }}>
                <div>{qr?.name}</div>

                <a
                  className='ellipsis qr-hov'
                  href={qr?.link}
                  target='_blank'
                  rel='noreferrer'
                  onClick={(e) => e.stopPropagation()}
                >
                  {qr?.link}
                </a>
              </div>

              <div className='grow' />
              <div
                className='mitem-caret'
                style={{ transform: "rotate(-90deg)" }}
              />
            </div>
          ))}
        </div>
      )}

      {showCreateOverlay && (
        <CreateQROverlay setShowCreateOverlay={setShowCreateOverlay} />
      )}
    </div>
  );
};

export default QR;
