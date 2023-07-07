import React, { useState } from "react";

import CreateQROverlay from "./CreateQROverlay";

const QR = () => {
  const [showCreateOverlay, setShowCreateOverlay] = useState(false);

  return (
    <div className="home-parent">
      <img className="home-logo" src="/assets/logo.jpeg" />
      <div className="home-krink">Inventory QR</div>

      <div className="home-f home-lp">
        <span>Your QR Codes</span>
        <div className="grow" />
        <div
          className="home-add home-create"
          onClick={() => setShowCreateOverlay(true)}
        >
          Create
        </div>
      </div>

      {showCreateOverlay && <CreateQROverlay />}
    </div>
  );
};

export default QR;
