import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { makeGetRequest } from "../requests/requestFunctions";

import "./store.scss";

const Stores = () => {
  const nav = useNavigate();

  const [stores, setStores] = useState([]);

  useEffect(() => {
    makeGetRequest("stores/fetchall").then((res) => {
      setStores(res);
    });
  }, []);

  console.log(stores);

  return (
    <div className="home-parent">
      <img className="home-logo" src="/assets/logo.jpeg" />
      <div className="home-krink">Inventory Stores</div>

      {stores?.map((store) => (
        <div className="store-map" onClick={() => nav(`/stores/${store?.id}`)}>
          <div>{store?.name}</div>
        </div>
      ))}
    </div>
  );
};

export default Stores;
