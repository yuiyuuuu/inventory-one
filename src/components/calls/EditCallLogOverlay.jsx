import React, { useState, useEffect } from "react";
import { makePutRequest } from "../../requests/helperFunctions";
import { useSelector } from "react-redux";

import { convertToDateTimeLocalString } from "../../requests/toDateTimeLocalStringFormat";

const EditCallLogOverlay = ({ setShow, prefill, store }) => {
  const allStores = useSelector((state) => state.allStores);

  const [name, setName] = useState(prefill?.name || null);
  const [title, setTitle] = useState(prefill?.title || null);
  const [body, setBody] = useState(prefill?.body || null);
  const [time, setTime] = useState(
    convertToDateTimeLocalString(new Date(prefill?.createdAt || ""))
  );

  const [selectedStore, setSelectedStore] = useState(store || null);

  const [showStores, setShowStores] = useState(false);

  const [nameError, setNameError] = useState(false);
  const [titleError, setTitleError] = useState(false);
  const [bodyError, setBodyError] = useState(false);
  const [storeError, setStoreError] = useState(false);

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

    const c = await makePutRequest("/calllog/edit", {
      id: prefill.id,
      name,
      title,
      body,
      storeId: selectedStore.id,
      time: time,
    })
      .then((res) => {
        if (res?.id) {
          setShow(false);

          //temp solution for now. I just want to get the feature working. Later on, we will map instead of reloading so if the user is keep in the logs, they wont lose their scroll position when they edit something
          window.location.reload();
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
        <div className="homec-l">Edit Call Log</div>

        <div className="homec-inputcontainer">
          {nameError && <div className="kh-error">Name Missing!</div>}

          <input
            className="homec-input"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="homec-inputcontainer">
          {titleError && <div className="kh-error">Title missing!</div>}

          <input
            className="homec-input"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="homec-inputcontainer">
          {bodyError && <div className="kh-error">Body Missing!</div>}

          <textarea
            className="cl-textarea"
            placeholder="Body"
            onChange={(e) => setBody(e.target.value)}
            value={body}
          />
        </div>

        <div className="homec-inputcontainer">
          {titleError && <div className="kh-error">Title missing!</div>}

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

export default EditCallLogOverlay;
