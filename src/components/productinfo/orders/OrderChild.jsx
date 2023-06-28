import React, { useEffect, useState } from "react";

const OrderChild = ({ order }) => {
  const [show, setShow] = useState(false);

  // i will come back to this, for now, i will turn overflow hidden off so we have double horizontal scroll
  // useEffect(() => {
  //   if (show) {
  //     $("#pi-orders").css("max-height", $(".pio-parent").outerHeight());
  //   } else {
  //     $("#pi-orders").css("max-height", $(".pio-parent").outerHeight());
  //   }
  // }, [show]);

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
        {order.store.name}
        <div className="grow" />
        <div
          className="mitem-caret"
          style={{ transform: !show && "rotate(-90deg)" }}
        />
      </div>
      <div style={{ maxHeight: show ? "300px" : 0 }} className="pi-w">
        <div className="pi-sub">Order ID: {order.id}</div>
        <div className="pi-sub">Quantity: {order.quantity}</div>
        <div className="pi-sub">Completed By: {order.user.name}</div>
      </div>
    </div>
  );
};

export default OrderChild;
