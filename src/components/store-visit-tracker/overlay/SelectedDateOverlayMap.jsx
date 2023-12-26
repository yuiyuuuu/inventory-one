import React, { useState } from "react";
import { useDispatch } from "react-redux";

import { getToken } from "../../../requests/getToken";
import { makePostRequestWithAuth } from "../../../requests/helperFunctions";
import { dispatchSetLoading } from "../../../store/global/loading";

const SelectedDateOverlayMap = ({ t, selectedDate, setVisit }) => {
  const dispatch = useDispatch();

  const [show, setShow] = useState(false);

  async function handleDelete() {
    const c = confirm("Confirm Delete Visit?");

    if (!c) return;

    dispatch(dispatchSetLoading(true));

    await makePostRequestWithAuth("visit/delete", { id: t.id }, getToken())
      .then((res) => {
        if (res === "deleted") {
          dispatch(dispatchSetLoading(false));

          setVisit((prev) => prev.filter((v) => v.id !== t.id));

          // setVisitTrackerSortedByDate((prev) => {
          //   console.log(prev[selectedDate], "prev");
          //   return {
          //     ...prev,
          //     [selectedDate]: prev[selectedDate].filter((c) => c.id !== t.id),
          //   };
          // });
        }
      })
      .catch((err) => {
        console.log(error);

        dispatch(dispatchSetLoading(false));

        alert("Something went wrong, please try again");
      });
  }

  return (
    <div className="vt-selcon">
      <div className="vt-sel" onClick={() => setShow((prev) => !prev)}>
        {t.store.name} - {t.user.name}
        <div className="grow" />
        <div
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
          className="home-add home-create"
          style={{ backgroundColor: "red", marginRight: "5px" }}
        >
          Delete
        </div>
        <div
          className="mitem-caret"
          style={{ transform: !show && "rotate(-90deg)" }}
        />
      </div>

      {show && (
        <div className="vt-desccon">
          <div className="f-s-main vt-desc">
            <span className="bold">Visitors: </span>
            {t.visitors}
          </div>
          <div className="f-s-main vt-desc">
            <span className="bold">Body: </span>

            <pre>{t.memo}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectedDateOverlayMap;
