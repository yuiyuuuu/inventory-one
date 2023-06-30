import React from "react";
import "./item.scss";

import DownArrow from "./svg/DownArrow";
import Pen from "./svg/Pen";
import UpArrow from "./svg/UpArrow";

//find a default image

const Item = ({
  item,
  setSelectedProduct,
  setShowEditOverlay,
  setShowSingleProduct,
  setSingleProductData,
  setShowAddOverlay,
  setShowSubtractOverlay,
  setOverlayData,
}) => {
  return (
    <div
      className="item-parent"
      onClick={() => {
        setShowSingleProduct(true);
        setSingleProductData(item);
        document.querySelector("html").style.overflow = "hidden";
      }}
    >
      <div className="item-row">
        <img
          src={
            item.image
              ? `data:image/png;base64,${item.image}`
              : "/assets/soap.jpeg"
          }
          className="item-img"
        />
        <div className="item-i">
          <div className="item-t">{item.name}</div>
          <div className="item-c item-t">
            QTY: {item.quantity} {item?.units || "pieces"}
          </div>
        </div>

        {/* <div className='grow' /> */}
        <div className="item-po">
          <div
            className="item-cli item-m"
            onClick={(e) => {
              e.stopPropagation();
              setShowAddOverlay(true);
              setOverlayData(item);

              // addSubtractOne("add", item);
            }}
          >
            <UpArrow />
          </div>

          <div
            className="item-cli item-m"
            onClick={(e) => {
              e.stopPropagation();
              setShowSubtractOverlay(true);
              setOverlayData(item);

              // addSubtractOne("subtract", item);
            }}
          >
            <DownArrow />
          </div>

          <div
            className="item-overwrite item-cli"
            onClick={(e) => {
              e.stopPropagation();

              setSelectedProduct(item);
              setShowEditOverlay(true);
              document.querySelector("html").style.overflow = "hidden";
            }}
          >
            <Pen />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Item;
