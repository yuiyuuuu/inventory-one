import React from "react";

import { useNavigate } from "react-router";

import TrashIcon from "../qr/svg/TrashIcon";

const TrackerMap = ({ tracker }) => {
  const nav = useNavigate();

  return (
    <div className="home-mapch" onClick={() => nav(`/time/${tracker.id}`)}>
      <div className="ellipsis" style={{ width: "75%", flexGrow: 1 }}>
        {tracker.name}
      </div>

      <div>IN</div>
      <div>OUT</div>

      <div className="item-overwrite item-cli qr-trash">
        <TrashIcon />
      </div>
    </div>
  );
};

export default TrackerMap;
