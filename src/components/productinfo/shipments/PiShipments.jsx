import React, { useState } from "react";

const PiShipments = ({ data }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="pio-inner">
      <div className="pio-bbot pi-fs">Uline - 07/23/2003</div>
      <div className="pi-w">
        <div className="pi-sub">Date: 07/23/2003</div>
        <div className="pi-sub">Store: ULine</div>

        <div className="pi-sub">Quantity: 20</div>
        <div className="pi-sub">Order Link: Click Here</div>
      </div>
    </div>
  );
};

export default PiShipments;
