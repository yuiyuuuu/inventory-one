import React, { useState } from "react";

const PiShipments = ({ data }) => {
  const [show, setShow] = useState(false);

  const shipDate = new Date(data?.shipmentDate);

  console.log(shipDate, shipDate.getDate());

  return (
    <div className="pio-inner">
      <div className="pio-bbot pi-fs" onClick={() => setShow((prev) => !prev)}>
        {data?.store} -{" "}
        {`${
          shipDate.getMonth() + 1
        }/${shipDate.getDate()}/${shipDate.getFullYear()}`}
        <div className="grow" />
        <div
          className="mitem-caret"
          style={{ transform: !show && "rotate(-90deg)" }}
        />
      </div>
      <div className="pi-w" style={{ maxHeight: show ? "200px" : "0" }}>
        <div className="pi-sub">ID: {data?.id}</div>
        <div className="pi-sub">
          Date:{" "}
          {`${
            shipDate.getMonth() + 1
          }/${shipDate.getDate()}/${shipDate.getFullYear()}`}
        </div>
        <div className="pi-sub">Store: {data?.store}</div>

        <div className="pi-sub">Quantity: {data?.quantity}</div>
        {data?.orderLink && (
          <div className="pi-sub">
            Order Link:{" "}
            <span
              className="pi-clickh"
              onClick={() => {
                const an = document.createElement("a");
                an.href = data?.orderLink;
                an.rel = "noreferrer";
                an.target = "_blank";
                an.click();
              }}
            >
              Click Here
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PiShipments;
