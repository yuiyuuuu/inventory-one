import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

import "./home.scss";

const Home = () => {
  const nav = useNavigate();

  const authState = useSelector((state) => state.auth);

  return (
    <div className='home-parent'>
      <img className='home-logo' src='/assets/logo.jpeg' />
      <div className='home-krink'>Inventory One</div>

      <div className='home-f home-lp'>
        <span>Your Lists</span>
        <div className='grow' />
        <div className='home-add home-create'>Create</div>
      </div>

      {!authState?.loading &&
        (authState?.lists?.length > 0 ? (
          <div className='home-mapcontainer'>
            {authState?.lists.map((list) => (
              <div
                className='home-mapch'
                onClick={() => nav(`/lists/${list.id}`)}
              >
                <span className='ellipsis' style={{ maxWidth: "90%" }}>
                  {list?.name}
                </span>

                <div className='grow' />
                <div
                  className='mitem-caret'
                  style={{ transform: "rotate(-90deg)" }}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className='home-no'>You have no lists</div>
        ))}

      <div className='home-f'>Shared Lists</div>
    </div>
  );
};

export default Home;
