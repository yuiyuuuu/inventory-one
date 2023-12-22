import React, { useState, useEffect } from "react";
import { makePostRequest } from "../../requests/helperFunctions";
import { useSelector } from "react-redux";

import { convertToDateTimeLocalString } from "../../requests/toDateTimeLocalStringFormat";

const titleChoices = [
  "General Check-in",
  "HR Related Questions",
  "Backup Schedule",
  "Store Maintenance",
  "Supply Inventory",
  "Other Department Requested Call",
];

const CreateCallLogOverlay = ({ setShow, prefill }) => {
  const allStores = useSelector((state) => state.allStores);

  const [name, setName] = useState(null);
  const [title, setTitle] = useState(null);
  const [body, setBody] = useState(null);

  const [showTitle, setShowTitle] = useState(false);

  const [selectedStore, setSelectedStore] = useState(prefill || null);

  const [showStores, setShowStores] = useState(false);

  const [nameError, setNameError] = useState(false);
  const [titleError, setTitleError] = useState(false);
  const [bodyError, setBodyError] = useState(false);
  const [storeError, setStoreError] = useState(false);

  const [time, setTime] = useState(convertToDateTimeLocalString(new Date()));

  async function handleSubmit() {
    let bad = false;

    setNameError(false);
    setTitleError(false);
    setBodyError(false);
    setStoreError(false);

    if (!name) {
      setNameError(true);
      bad = true;
    }

    if (!body) {
      setBodyError(true);
      bad = true;
    }

    if (!title) {
      setTitleError(true);
      bad = true;
    }

    if (!selectedStore?.id) {
      setStoreError(true);
      bad = true;
    }

    if (bad) return;

    const c = await makePostRequest("/calllog/create", {
      name,
      title,
      body,
      storeId: selectedStore.id,
      time: time,
    })
      .then((res) => {
        if (res?.storeId) {
          window.location.href = "/calls/" + res.storeId;
        }
      })
      .catch(() => {
        alert("Something went wrong, please try again");
      });
  }

  useEffect(() => {
    $("#call-selch").css("top", $("#call-sel").outerHeight() + 9); //margin 10 - 1
  }, [showStores]);

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
    <div
      className="home-createoverlay"
      onClick={() => {
        setShow(false);
        document.querySelector("html").style.overflow = "auto";
      }}
    >
      <div
        className="homec-inner"
        onClick={(e) => e.stopPropagation()}
        style={{
          minHeight: showStores && "70vh",
          justifyContent: showStores && "unset",
        }}
      >
        <div className="homec-l">Create Call Log</div>

        {/* <div className="homec-inputcontainer">

          <input
            className="homec-input"
            placeholder="Title"
            onChange={(e) => setTitle(e.target.value)}
          />
        </div> */}

        <div className="pio-rel" style={{ display: "block" }}>
          {titleError && <div className="kh-error">Title missing!</div>}

          <div
            className="pio-select"
            style={{ margin: "10px 0 0" }}
            onClick={() => setShowTitle((prev) => !prev)}
          >
            {!title ? "Select Subject" : title}
            <div className="grow" />{" "}
            <div
              className="mitem-caret"
              style={{ transform: !showTitle && "rotate(-90deg)" }}
            />
          </div>

          {showTitle && (
            <div className="emp-sel">
              {titleChoices.map((c) => (
                <div
                  className="emp-selch"
                  onClick={() => {
                    setTitle(c);
                    setShowTitle(false);
                  }}
                >
                  {c}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="homec-inputcontainer">
          {nameError && <div className="kh-error">Name Missing!</div>}

          <input
            className="homec-input"
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
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

        <div className="homec-inputcontainer">
          <input
            className="homec-input rel"
            placeholder="Time"
            type="datetime-local"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>

        <div className="pio-rel" style={{ display: "block" }}>
          {storeError && <div className="kh-error">Select a store!</div>}
          <div
            className="pio-select"
            onClick={() => setShowStores((prev) => !prev)}
            id="call-sel"
            style={{ width: "calc(100% - 16px)" }}
          >
            <div className="ellipsis">
              {selectedStore?.id ? selectedStore?.name : "Select a store"}
            </div>
            <div className="grow" />
            <div
              className="mitem-caret"
              style={{ transform: !showStores && "rotate(-90deg)" }}
            />
          </div>

          {showStores && (
            <div className="pio-selch" id="call-selch">
              {allStores.slice(1).map((store, i, a) => (
                <div
                  className="pio-ch"
                  onClick={() => {
                    setSelectedStore(store);
                    setShowStores(false);
                  }}
                >
                  {store.name}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="homec-submit homec-but " onClick={() => handleSubmit()}>
          Submit
        </div>
      </div>
    </div>
  );
};

export default CreateCallLogOverlay;
