import React, { useState } from "react";

import "./home.scss";

import SearchSvg from "./svg/SearchSvg";
import Item from "../item/Item";

const placeholderItems = [
  {
    id: "handsoap",
    name: "Hand Soap",
    qty: "30",
  },

  {
    id: "handsoap2",
    name: "Hand Soap2",
    qty: "31",
  },
  {
    id: "handsoap3",
    name: "Hand Soap3",
    qty: "303",
  },
];

const Home = () => {
  const [inputValue, setInputValue] = useState("");

  return (
    <div className='home-parent'>
      <div className='home-q'>
        <div className='home-inparent'>
          <SearchSvg />
          <input
            className='home-searchq'
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder='Search'
          />
        </div>
      </div>

      <div className='home-itemmap'>
        {placeholderItems.map((item) => (
          <Item item={item} />
        ))}
      </div>
    </div>
  );
};

export default Home;
