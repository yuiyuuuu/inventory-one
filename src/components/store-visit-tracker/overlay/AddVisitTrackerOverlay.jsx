import React, { useState, useEffect } from "react";

import SubmitButton from "../../global/OvlerlaySubmitButton";
import { useSelector } from "react-redux";

const AddVisitTrackerOverlay = ({ set }) => {
  const allStores = useSelector((state) => state.allStores);

  console.log(allStores);

  const [date, setDate] = useState(new Date());

  const [selectedStore, setSelectedStore] = useState(null);
  const [showSelectStore, setShowSelectStore] = useState(false);

  const [body, setBody] = useState(null);

  const [bodyError, setBodyError] = useState(false);

  async function handleSubmit() {}

  useEffect(() => {
    $(".cl-textarea")
      .each(function () {
        this.setAttribute(
          "style",
          "height:" + this.scrollHeight + "px;overflow-y:hidden;"
        );
      })
      .on("input", function () {
        this.style.height = 0;
        this.style.height = this.scrollHeight + "px";
      });
  }, []);

  return (
    <div className="home-createoverlay" onClick={() => set(false)}>
      <div className="homec-inner" onClick={(e) => e.stopPropagation()}>
        <div className="homec-l">Add Visit</div>

        <div style={{ width: "100%", marginTop: "12px" }}>
          <div className="pio-rel" style={{ display: "unset" }}>
            <div
              className="pio-select"
              style={{ margin: 0 }}
              id="fe-store"
              onClick={() => setShowSelectStore((prev) => !prev)}
            >
              <div className="ellipsis">
                {/* {storeFilter
                  ?.map((v, i) => (i !== 0 ? " " + v?.name : v?.name))
                  ?.toString() || "Select Store"} */}
                {selectedStore?.name || "Select Store"}
              </div>

              <div className="grow" />
              <div
                className="mitem-caret"
                style={{ transform: !showSelectStore && "rotate(-90deg)" }}
              />
            </div>

            {showSelectStore && (
              <div
                className="pio-selch pi-qpa"
                id="fe-storec"
                style={{ position: "unset", marginTop: "-1px" }}
              >
                {/* <div
                  className="pio-ch"
                  onClick={() => {
                    setStoreFilter(null);
                    setShowStore(false);
                  }}
                >
                  Unselect Stores
                </div> */}
                {allStores.map((store, i, a) => (
                  <div
                    className="pio-ch"
                    onClick={() => {
                      setSelectedStore(store);
                      setShowSelectStore(false);
                    }}
                  >
                    {store.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="homec-inputcontainer">
          <div className="f-s-main" style={{ marginBottom: "8px" }}>
            Date of Visit
          </div>

          <input
            className="homec-input rel"
            placeholder="Time"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="homec-inputcontainer">
          {bodyError && <div className="kh-error">Body Missing!</div>}

          <textarea
            className="cl-textarea"
            placeholder="Body"
            onChange={(e) => setBody(e.target.value)}
          />
        </div>

        <div style={{ marginTop: "10px" }} onClick={() => handleSubmit()}>
          <SubmitButton text={"Submit"} />
        </div>
      </div>
    </div>
  );
};

export default AddVisitTrackerOverlay;
