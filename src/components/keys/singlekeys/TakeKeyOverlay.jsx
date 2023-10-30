import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import $ from "jquery";

import {
  makePostRequest,
  makePostRequestWithAuth,
} from "../../../requests/helperFunctions";

import CheckMark from "./svg/CheckMark";

const TakeKeyOverlay = ({
  setShowTakeOverlay,
  selectedStore,
  setSelectedStore,
}) => {
  const allStores = useSelector((state) => state.allStores);
  const authstate = useSelector((state) => state.auth);

  const [name, setName] = useState("");
  const [memo, setMemo] = useState("");

  const [show, setShow] = useState(false);
  const [selected, setSelected] = useState(
    selectedStore?.id && allStores.find((v) => v.id === selectedStore.id)
      ? [allStores.find((v) => v.id === selectedStore.id)]
      : []
  );

  //error states
  const [noStore, setNoStore] = useState(false);
  const [noName, setNoName] = useState(false);

  async function handleSubmit() {
    //set error states to false
    setNoName(false);
    setNoStore(false);

    let bad = false;

    if (!name) {
      setNoName(true);
      bad = true;
    }

    if (!selected.length) {
      setNoStore(true);
      bad = true;
    }

    if (bad) return;

    const obj = {
      name: name,
      memo: memo && memo,
      takeTime: new Date(),
      stores: selected,
    };

    const c = confirm(
      `Take keys for ${selected
        .map((v, i) => (i !== 0 ? " " + v?.name : v?.name))
        ?.toString()}?`
    );

    if (!c) return;

    await makePostRequestWithAuth(
      `keys/create`,
      obj,
      import.meta.env.VITE_ROUTEPASS
    )
      .then((res) => {
        if (res?.id) {
          if (authstate.id) {
            window.location.href = `/keys/${res.id}`;
          } else {
            alert("Successfully Logged");
            setShowTakeOverlay(false);
          }
        }
      })
      .catch(() => {
        alert("Something went wrong, please try again");
      });
  }

  const clickout = useCallback(() => {
    const $target = $(event.target);

    if (
      !$target.closest("#kh-sel").length &&
      !$target.closest("#kh-selc").length &&
      $("#kh-selc").is(":visible")
    ) {
      setShow(false);
    }
  }, []);

  $("#kh-inner").off().on("click", clickout);

  useEffect(() => {
    $("#kh-selc").css("top", $("#kh-sel").outerHeight() + 9); //margin 10 - 1
  }, [show]);

  useEffect(() => {
    $("#kh-namein").focus(() => {
      $("#kh-namein")
        .parent()
        .css("border-bottom", "1px solid rgba(0, 255,255)");
    });

    $("#kh-namein").focusout(() => {
      $("#kh-namein").parent().css("border-bottom", "1px solid red");
    });

    $("#kh-memo").focus(() => {
      $("#kh-memo").parent().css("border-bottom", "1px solid rgba(0, 255,255)");
    });

    $("#kh-memo").focusout(() => {
      $("#kh-memo").parent().css("border-bottom", "1px solid red");
    });
  }, []);

  return (
    <div
      className="home-createoverlay"
      onClick={() => {
        document.querySelector("html").style.overflow = "";
        setShowTakeOverlay(false);
      }}
    >
      <div
        className="homec-inner"
        id="kh-inner"
        onClick={(e) => e.stopPropagation()}
        style={{ minHeight: show && "50vh", justifyContent: show && "unset" }}
      >
        <div className="homec-l">Take Key</div>
        <div className="homec-inputcontainer">
          {noName && <div className="kh-error">Name is required!</div>}
          <input
            className="homec-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            id="kh-namein"
            placeholder="Name"
          />
        </div>
        <div className="homec-inputcontainer">
          <input
            className="homec-input"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            id="kh-memo"
            placeholder="Memo (Optional)"
          />
        </div>

        <div className="pio-rel" style={{ flexDirection: "column" }}>
          {noStore && <div className="kh-error">Select a store!</div>}

          <div
            className="pio-select"
            onClick={() => setShow((prev) => !prev)}
            id="kh-sel"
            style={{ width: "calc(100% - 16px)" }}
          >
            <div className="ellipsis">
              {selected?.length > 0
                ? selected
                    .map((v, i) => (i !== 0 ? " " + v?.name : v?.name))
                    ?.toString()
                : "Select a store"}
            </div>
            <div className="grow" />
            <div
              className="mitem-caret"
              style={{ transform: !show && "rotate(-90deg)" }}
            />
          </div>
          {show && (
            <div className="pio-selch" id="kh-selc">
              {allStores.map((store, i, a) => (
                <div
                  className="pio-ch"
                  style={{
                    borderBottom:
                      i === a.length - 1
                        ? "none"
                        : selected.find((v) => v.id === store.id)?.id
                        ? "1px solid black"
                        : "",
                    backgroundColor: selected.find((v) => v.id === store.id)?.id
                      ? "white"
                      : "",
                    color: selected.find((v) => v.id === store.id)?.id
                      ? "black"
                      : "",
                    display: "flex",
                  }}
                  onClick={() => {
                    setSelected((prev) => {
                      const find = selected.find((v) => v.id === store.id);
                      //exists in current array so its selected
                      if (find?.id) {
                        return prev.filter((v) => v.id !== find.id);
                      }

                      return [...prev, store];
                    });
                  }}
                >
                  {store.name}

                  <div className="grow" />

                  {selected.find((v) => v.id === store.id)?.id && <CheckMark />}
                </div>
              ))}
            </div>
          )}
        </div>
        <button
          className="homec-submit homec-but"
          onClick={() => {
            handleSubmit();
          }}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default TakeKeyOverlay;
