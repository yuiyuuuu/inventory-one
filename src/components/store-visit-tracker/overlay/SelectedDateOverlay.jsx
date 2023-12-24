import React from "react";

const SelectedDateOverlay = ({ set, selectedTrackers }) => {
  console.log(selectedTrackers, "sel");

  return (
    <div className='home-createoverlay' onClick={() => set()}>
      <div className='homec-inner' onClick={(e) => e.stopPropagation}>
        <div className='homec-l'></div>
      </div>
    </div>
  );
};

export default SelectedDateOverlay;
