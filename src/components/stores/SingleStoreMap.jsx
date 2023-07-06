import React, { useEffect, useState } from "react";

const SingleStoreMap = ({ sortedOrders, date }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(false);
  }, [sortedOrders[date]]);

  return (
    <div className="ss-out">
      <div className="ss-firstmap" onClick={() => setShow((prev) => !prev)}>
        {date} <div className="grow" />{" "}
        <div
          className="mitem-caret"
          style={{ transform: !show && "rotate(-90deg)" }}
        />
      </div>

      <div
        className="ss-selectedordermap"
        style={{ maxHeight: show ? sortedOrders[date].length * 200 + "px" : 0 }}
      >
        {sortedOrders[date]?.map((order, i) => (
          <div className="ss-ordermapinner">
            <div className="ss-qp">Order ID: {order?.id}</div>
            <div className="ss-qp">Item: {order?.item?.name}</div>
            <div className="ss-qp">Quantity: {order?.quantity}</div>
            <div className="ss-qp">List: {order?.item?.list?.name}</div>

            <div className="ss-qp">Completed By: {order?.user?.name}</div>

            <div
              className="ss-divider"
              style={{ display: i === sortedOrders[date].length - 1 && "none" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SingleStoreMap;
