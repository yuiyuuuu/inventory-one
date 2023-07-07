import React from "react";

const CreateQROverlay = ({ setShowCreateOverlay }) => {
  return (
    <div
      className="home-createoverlay"
      onClick={() => setShowCreateOverlay(false)}
    >
      <div className="home-inner" onClick={(e) => e.stopPropagation()}></div>
    </div>
  );
};

export default CreateQROverlay;
