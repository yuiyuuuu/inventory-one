import React from "react";
import "./item.scss";

import DownArrow from "./svg/DownArrow";
import Pen from "./svg/Pen";
import UpArrow from "./svg/UpArrow";

//find a default image

const Item = ({
  item,
  addSubtractOne,
  setSelectedProduct,
  setShowEditOverlay,
  setShowSingleProduct,
  setSingleProductData,
}) => {
  return (
    <div
      className="item-parent"
      onClick={() => {
        setShowSingleProduct(true);
        setSingleProductData(item);
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

        <div className="item-po">
          <div
            className="item-cli item-m"
            onClick={(e) => {
              e.stopPropagation();

              addSubtractOne("add", item);
            }}
          >
            <UpArrow />
          </div>

          <div
            className="item-cli item-m"
            onClick={(e) => {
              e.stopPropagation();
              addSubtractOne("subtract", item);
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
