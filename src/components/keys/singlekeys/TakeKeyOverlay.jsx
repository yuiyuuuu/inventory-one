import React, { useEffect, useState } from "react";

import $ from "jquery";
import { makePostRequest } from "../../requests/requestFunctions";

const TakeKeyOverlay = ({
  setShowTakeOverlay,
  selectedStore,
  setSelectedStore,
}) => {
  const [name, setName] = useState("");
  const [memo, setMemo] = useState("");

  const [noName, setNoName] = useState(false);

  async function handleSubmit() {
    setNoName(false);
    if (!name) {
      setNoName(true);
      return;
    }

    const obj = {
      name: name,
      memo: memo && memo,
      takeTime: new Date(),
      storeId: selectedStore.id,
    };

    await makePostRequest("keys/create", obj)
      .then((res) => {
        if (res.id) {
          setSelectedStore(res);
          setShowTakeOverlay(false);
        }
      })
      .catch(() => {
        alert("Something went wrong, please try again");
      });
  }

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
      onClick={() => setShowTakeOverlay(false)}
    >
      <div className="homec-inner" onClick={(e) => e.stopPropagation()}>
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
