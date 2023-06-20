import React, { useState, useEffect } from "react";

import $ from "jquery";
import { makePutRequest } from "../../requests/requestFunctions";

const SubtractOverlay = ({
  setShowSubtractOverlay,
  setOverlayData,
  allStores,
  overlayData,
}) => {
  const [showSelectStores, setShowSelectStores] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);

  const [quantity, setQuantity] = useState(1);

  async function handleSubmit() {
    const obj = {
      which: "subtract",
      quantity: quantity,
      id: overlayData.id,
      storeId: selectedStore.id,
      user: "Yingson.Yu", //im pretty much the only one doing supply for now, change if we add other users
    };

    await makePutRequest("/item/editqty", obj).then((res) => {
      console.log(res);

      if (res.id) {
        setOverlayData({});
        setShowSubtractOverlay(false);
        alert("Quantity Updated");
      }
    });
  }

  useEffect(() => {
    $("#ov-sub")
      .focus()
      .parent()
      .css("border-bottom", "1px solid rgba(0,255,255)");

    $("#ov-sub").focus(() => {
      $("#ov-sub").parent().css("border-bottom", "1px solid rgba(0, 255,255)");
    });

    $("#ov-sub").focusout(() => {
      $("#ov-sub").parent().css("border-bottom", "1px solid red");
    });
  }, []);

  useEffect(() => {
    $(".aover-selch").css("top", $(".aover-select").outerHeight() + 9);
  }, [showSelectStores]);

  return (
    <div className='ov-parent' onClick={() => setShowSubtractOverlay(false)}>
      <div className='homec-inner' onClick={(e) => e.stopPropagation()}>
        <div className='homec-l'>Subtract Quantity (Create Order)</div>
        <div className='ov-divider' />

        <div className='homec-l'>{overlayData?.name}</div>
        <div className='pio-rel'>
          <div
            className='pio-select  aover-select'
            onClick={() => setShowSelectStores((prev) => !prev)}
            style={{ padding: "5px" }}
          >
            {selectedStore ? selectedStore.name : "Select a store"}
            <div className='grow' />
            <div
              className='mitem-caret'
              style={{ transform: !showSelectStores && "rotate(-90deg)" }}
            />
          </div>

          {showSelectStores && (
            <div className='pio-selch aover-selch'>
              {allStores?.map((v) => (
                <div
                  className='pio-ch'
                  onClick={() => {
                    setShowSelectStores(false);
                    setSelectedStore(v);
                  }}
                >
                  {v?.name}
                </div>
              ))}
            </div>
          )}
        </div>
        <div
          className='homec-inputcontainer'
          style={{ margin: "0 8px", width: "calc(100% - 16px)" }}
        >
          <input
            placeholder='Quantity'
            className='homec-input'
            value={quantity}
            type='number'
            id='ov-sub'
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>

        <div
          className='homec-submit homec-but ov-submit'
          onClick={() => handleSubmit()}
        >
          Submit
        </div>
      </div>
    </div>
  );
};

export default SubtractOverlay;
