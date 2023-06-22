import React from "react";
import { useDispatch, useSelector } from "react-redux";
import sidebar, { dispatchSetSidebarState } from "../../store/sidebar";

const Sidebar = () => {
  const dispatch = useDispatch();

  const sidebarState = useSelector((state) => state.sidebarState);

  return (
    <div
      className="side-inner"
      style={{
        transform: sidebarState.display
          ? "translate(0)"
          : "translate(-300px, 0)",
      }}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div className="side-acontainer">
        <a className="side-a" href="/">
          Inventory One
        </a>
        <a className="side-a" href="/stores">
          Inventory Stores
        </a>
      </div>
    </div>
  );
};

export default Sidebar;
