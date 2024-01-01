import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const CdsDate = ({ v, idv, trackers, visitorsSorted, colors }) => {
  const nav = useNavigate();

  const [trackersTd, setTrackersTd] = useState();

  useEffect(() => {
    //null or undefined trackers mean that this date has none
    if (!trackers) return;

    setTrackersTd(
      trackers.sort((a, b) => {
        return (
          new Date(b.actionTime).getTime() - new Date(a.actionTime).getTime()
        );
      })
    );
  }, [trackers]);

  trackersTd;

  return (
    <div
      className={`v-cds-date`}
      // onClick={(e) => {
      //   const c = setValue($(e.target).html(), i);
      //   setFunction(c);
      //   setDisplay(false);
      // }}
      onClick={() => nav(`/visit/?sel=${v}`)}
    >
      <div
        className={`cds-date-${idv} v-cds-p`}
        style={{
          backgroundColor:
            new Date(new Date().setHours(0, 0, 0, 0)).getTime() ===
              new Date(v).getTime() && "white",
          color:
            new Date(new Date().setHours(0, 0, 0, 0)).getTime() ===
              new Date(v).getTime() && "black",
        }}
      ></div>

      {trackers && (
        <div className='cds-visit-mapcon'>
          {trackers.slice(0, 3).map((t) => (
            <div
              className='cds-visit-map ellipsis'
              style={{
                backgroundColor:
                  colors[visitorsSorted.map((t) => t.id).indexOf(t.user.id)],
              }}
            >
              {t.store.name}
            </div>
          ))}

          {trackers.length > 3 && (
            <div className='f-s-main cds-visit-more'>
              + {trackers.length - 3}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CdsDate;
