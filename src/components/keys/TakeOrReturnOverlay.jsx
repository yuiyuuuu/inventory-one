import React from "react";

const TakeOrReturnOverlay = ({
  setTakeOrReturnOverlay,
  setShowTakeOverlay,
  setShowReturnOverlay,
}) => {
  return (
    <div
      className="home-createoverlay"
      onClick={() => setTakeOrReturnOverlay(false)}
    >
      <div
        className="homec-inner kh-toroinner"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="kh-con">
          <div
            className="kh-selectbut kh-take home-add kh-toromedia"
            onClick={() => {
              setTakeOrReturnOverlay(false);
              setShowTakeOverlay(true);
            }}
          >
            Take Key
          </div>

          <div className="kh-torodivider" />

          <div
            className="kh-return2 home-add kh-selectbut kh-toromedia"
            onClick={() => {
              setTakeOrReturnOverlay(false);
              setShowReturnOverlay(true);
            }}
          >
            Return Key
          </div>
        </div>
      </div>
    </div>
  );
};

export default TakeOrReturnOverlay;
