import React, { useEffect, useState } from "react";

const OrderChildStore = ({ order, date }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(false);
  }, [order]);

  return (
    <div className="pio-inner">
      <div
        onClick={() => {
          setShow((prev) => !prev);
        }}
        className="pio-bbot pi-fs"
      >
        {date}
        <div className="grow" />
        <div
          className="mitem-caret"
          style={{ transform: !show && "rotate(-90deg)" }}
        />
      </div>
      <div
        style={{ maxHeight: show ? order.length * 170 + "px" : 0 }}
        className="pi-w"
      >
        {order.map((v, i) => (
          <div className="ss-ordermapinner">
            <div className="ss-qp">Order ID: {v?.id}</div>
            <div className="ss-qp">Store: {v?.store?.name}</div>
            <div className="ss-qp">Quantity: {v?.quantity}</div>
            <div className="ss-qp">Completed By: {v?.user?.name}</div>

            <div
              className="ss-divider"
              style={{ display: i === order.length - 1 && "none" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderChildStore;
