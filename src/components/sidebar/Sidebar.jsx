import React from "react";
import { useSelector } from "react-redux";

const Sidebar = () => {
  const sidebarState = useSelector((state) => state.sidebarState);

  return (
    <div
      className="side-parent"
      style={{
        transform: sidebarState.display
          ? "translate(0)"
          : "translate(-300px, 0)",
      }}
    >
      <div>sidebar</div>
    </div>
  );
};

export default Sidebar;
