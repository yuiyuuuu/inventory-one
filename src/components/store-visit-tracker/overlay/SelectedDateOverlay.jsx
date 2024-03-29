import React from "react";

import { months } from "../../../requests/dateObj";
import SelectedDateOverlayMap from "./SelectedDateOverlayMap";

const SelectedDateOverlay = ({
  set,
  selectedTrackers,
  selectedDate,
  setVisit,
}) => {
  selectedTrackers, "sel";

  if (!selectedTrackers || selectedTrackers?.length < 1) {
    return (
      <div className='home-createoverlay' onClick={() => set()}>
        <div className='homec-inner' onClick={(e) => e.stopPropagation()}>
          <div className='homec-l'>
            {`${months[new Date(selectedDate).getMonth()]} ${new Date(
              selectedDate
            ).getDate()}, ${new Date(selectedDate).getFullYear()}`}
          </div>

          <div className='f-s-main' style={{ marginTop: "20px" }}>
            There are no visits on this day
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='home-createoverlay' onClick={() => set()}>
      <div
        className='homec-inner'
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: "80vh" }}
      >
        <div className='homec-l'>
          {`${months[new Date(selectedDate).getMonth()]} ${new Date(
            selectedDate
          ).getDate()}, ${new Date(selectedDate).getFullYear()}`}
        </div>

        {selectedTrackers
          .sort((a, b) => {
            return (
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
          })
          .map((t) => (
            <SelectedDateOverlayMap
              t={t}
              selectedDate={selectedDate}
              setVisit={setVisit}
            />
          ))}
      </div>
    </div>
  );
};

export default SelectedDateOverlay;
