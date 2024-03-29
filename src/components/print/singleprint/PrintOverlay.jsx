import React, { useState } from "react";

const PrintOverlay = ({ setShowPrintOverlay, currentPrintList }) => {
  const [qty, setQty] = useState(0);

  const [invalidQty, setInvalidQty] = useState(false);
  const [noFiles, setNoFiles] = useState(false);

  function handleSubmit() {
    setInvalidQty(false);
    setNoFiles(false);

    let bad = false;

    const allFiles = currentPrintList?.printFiles;

    if (allFiles.length < 1) {
      setNoFiles(true);
      bad = true;
      return;
    }

    if (qty < 1) {
      setInvalidQty(true);
      bad = true;
    }

    if (String(qty)[0] === "0") {
      setInvalidQty(true);
      bad = true;
    }

    if (bad) {
      return;
    }

    const a = document.createElement("a");
    a.target = "_blank";
    a.href = `/printlist/${currentPrintList?.id}/${qty}`;
    a.rel = "noopener noreferrer";

    window.open(a);
  }

  return (
    <div
      className='home-createoverlay'
      onClick={() => setShowPrintOverlay(false)}
    >
      <div className='homec-inner' onClick={(e) => e.stopPropagation()}>
        <div className='homec-l'>Print List</div>

        {invalidQty && (
          <div
            className='home-error'
            style={{ alignSelf: "start", marginBottom: "-10px" }}
          >
            Invalid Quantity
          </div>
        )}

        {noFiles && (
          <div
            className='home-error'
            style={{ alignSelf: "start", marginBottom: "-10px" }}
          >
            No Files in this List!
          </div>
        )}
        <div className='homec-inputcontainer'>
          <input
            placeholder='Name'
            className='homec-input'
            value={qty}
            type='number'
            onChange={(e) => setQty(e.target.value)}
          />
        </div>

        <button
          className='homec-submit homec-but'
          onClick={() => handleSubmit()}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default PrintOverlay;
