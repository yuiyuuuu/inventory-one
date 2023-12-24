import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makePostRequestWithAuth } from "../../../requests/helperFunctions";

import { dispatchSetLoading } from "../../../store/global/loading";
import { setErrorStatesFalse, validateForm } from "../../../store/validateForm";
import SubmitButton from "../../global/OvlerlaySubmitButton";

const AddVisitTrackerOverlay = ({ set, setVisit }) => {
  const dispatch = useDispatch();

  const allStores = useSelector((state) => state.allStores);
  const authstate = useSelector((state) => state.auth);

  const [date, setDate] = useState(
    `${new Date().getFullYear()}-${
      new Date().getMonth() + 1
    }-${new Date().getDate()}`
  );

  const [selectedStore, setSelectedStore] = useState(null);
  const [showSelectStore, setShowSelectStore] = useState(false);

  const [visitors, setVisitors] = useState(null);

  const [body, setBody] = useState(null);

  const [bodyError, setBodyError] = useState(false);
  const [storeError, setStoreError] = useState(false);
  const [dateError, setDateError] = useState(false);
  const [visitorError, setVisitorError] = useState(false);

  async function handleSubmit() {
    //error states to false
    setErrorStatesFalse([
      setBodyError,
      setStoreError,
      setDateError,
      setVisitorError,
    ]);

    const validate = validateForm([
      { value: selectedStore?.id, f: setStoreError },
      { value: date, f: setDateError },
      { value: visitors, f: setVisitorError },
      { value: body, f: setBodyError },
    ]);

    if (!validate) return;

    dispatch(dispatchSetLoading(true));

    await makePostRequestWithAuth("visit/create", {
      storeId: selectedStore.id,
      date: date,
      memo: body,
      visitors,
      userId: authstate.id,
    }).then((res) => {
      dispatch(dispatchSetLoading(false));
      if (res) {
        setVisit((prev) => {
          const time = new Date(date)
            .toLocaleDateString("UTC", {
              timeZone: "Etc/UTC",
            })
            .replace(/^\S+\s/, "");

          return { ...prev, [time]: prev[time] ? [...prev[time], res] : [res] };
        });

        set(false);
      }
    });
  }

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
    <div className='home-createoverlay' onClick={() => set(false)}>
      <div className='homec-inner' onClick={(e) => e.stopPropagation()}>
        <div className='homec-l'>Add Visit</div>

        <div style={{ width: "100%", marginTop: "12px" }}>
          {storeError && <div className='kh-error'>Store is required!</div>}

          <div className='pio-rel' style={{ display: "unset" }}>
            <div
              className='pio-select'
              style={{ margin: 0 }}
              id='fe-store'
              onClick={() => setShowSelectStore((prev) => !prev)}
            >
              <div className='ellipsis'>
                {/* {storeFilter
                  ?.map((v, i) => (i !== 0 ? " " + v?.name : v?.name))
                  ?.toString() || "Select Store"} */}
                {selectedStore?.name || "Select Store"}
              </div>

              <div className='grow' />
              <div
                className='mitem-caret'
                style={{ transform: !showSelectStore && "rotate(-90deg)" }}
              />
            </div>

            {showSelectStore && (
              <div
                className='pio-selch pi-qpa'
                id='fe-storec'
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
                    className='pio-ch'
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

        <div className='homec-inputcontainer'>
          {dateError && <div className='kh-error'>Date is required!</div>}
          <div className='f-s-main' style={{ marginBottom: "8px" }}>
            Date of Visit
          </div>

          <input
            className='homec-input rel'
            placeholder='Time'
            type='date'
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className='homec-inputcontainer'>
          {visitorError && <div className='kh-error'>Vistor is required!</div>}

          <input
            className='homec-input rel'
            placeholder='Visitors'
            onChange={(e) => setVisitors(e.target.value)}
            value={visitors}
          />
        </div>

        <div className='homec-inputcontainer'>
          {bodyError && <div className='kh-error'>Body Missing!</div>}

          <textarea
            className='cl-textarea'
            placeholder='Body'
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
