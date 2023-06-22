import React from "react";
import { useDispatch, useSelector } from "react-redux";

import "./side.scss";

import $ from "jquery";
import { dispatchSetSidebarState } from "../../store/sidebar";

const BurgerIcon = () => {
  const dispatch = useDispatch();
  const sidebarState = useSelector((state) => state.sidebarState);

  function toggleSidebar() {
    dispatch(dispatchSetSidebarState({ display: !sidebarState.display }));
  }

  return (
    <div
      className={`imhungryc ${sidebarState.display ? "active" : ""}`}
      onClick={() => toggleSidebar()}
    >
      <div className='imhungry mar top'></div>
      <div className='imhungry nomar middle'></div>
      <div className='imhungry mar bottom'></div>
    </div>
  );
};

export default BurgerIcon;
