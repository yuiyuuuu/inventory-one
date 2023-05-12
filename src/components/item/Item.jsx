import React from "react";
import "./item.scss";

import DownArrow from "./svg/DownArrow";
import Pen from "./svg/Pen";
import UpArrow from "./svg/UpArrow";

const Item = ({ item }) => {
  return (
    <div className='item-parent'>
      <div className='item-row'>
        <img src='/assets/soap.jpeg' className='item-img' />
        <div className='item-i'>
          <div className='item-t'>{item.name}</div>
          <div className='item-c'>Quantity: {item.qty}</div>
        </div>

        <div className='item-po'>
          <div className='item-cli item-m'>
            <UpArrow />
          </div>

          <div className='item-cli item-m'>
            <DownArrow />
          </div>

          <div className='item-overwrite item-cli'>
            <Pen />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Item;
