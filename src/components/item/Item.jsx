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
}) => {
  return (
    <div className='item-parent'>
      <div className='item-row'>
        <img
          src={
            item.image
              ? `data:image/png;base64,${item.image}`
              : "/assets/soap.jpeg"
          }
          className='item-img'
        />
        <div className='item-i'>
          <div className='item-t'>{item.name}</div>
          <div className='item-c'>Quantity: {item.quantity}</div>
        </div>

        <div className='item-po'>
          <div
            className='item-cli item-m'
            onClick={() => addSubtractOne("add", item)}
          >
            <UpArrow />
          </div>

          <div
            className='item-cli item-m'
            onClick={() => addSubtractOne("subtract", item)}
          >
            <DownArrow />
          </div>

          <div
            className='item-overwrite item-cli'
            onClick={() => {
              setSelectedProduct(item);
              setShowEditOverlay(true);
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
