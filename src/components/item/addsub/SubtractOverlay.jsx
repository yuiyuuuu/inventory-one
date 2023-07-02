import React, { useState, useEffect } from "react";

import $ from "jquery";
import { makePutRequest } from "../../requests/requestFunctions";

const SubtractOverlay = ({
  setShowSubtractOverlay,
  setOverlayData,
  allStores,
  overlayData,
  setAllProducts,
}) => {
  const [showSelectStores, setShowSelectStores] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);

  const [quantity, setQuantity] = useState(1);

  const [noStoreError, setNoStoreError] = useState(false);
  const [badQtyError, setBadQtyError] = useState(false);
  const [leadingZero, setLeadingZero] = useState(false);

  async function handleSubmit() {
    let error = false;

    setNoStoreError(false);
    setBadQtyError(false);

    if (!selectedStore?.id) {
      setNoStoreError(true);
      error = true;
    }

    if (parseInt(quantity) < 1) {
      setBadQtyError(true);
      error = true;
    }

    if (error) {
      return;
    }

    const obj = {
      which: "subtract",
      quantity: parseInt(quantity),
      id: overlayData.id,
      storeId: selectedStore.id,
      user: "Yingson.Yu", //im pretty much the only one doing supply for now, change if we add other users
    };

    await makePutRequest("item/editqty", obj)
      .then((res) => {
        if (res.id) {
          setOverlayData({});
          setShowSubtractOverlay(false);
          setAllProducts((prev) =>
            prev.map((item) => (item.id === res.id ? res : item))
          );
          alert("Order created");
        }
      })
      .catch(() => {
        alert("Something went wrong, please try again");
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
      <div
        className='homec-inner ov-inner'
        onClick={(e) => e.stopPropagation()}
        style={{
          height: showSelectStores ? "45vh" : "30vh",
          justifyContent: showSelectStores && "unset",
        }}
      >
        <div className='homec-l'>Subtract Quantity (Create Order)</div>
        <div className='ov-divider' />

        <div className='homec-l'>{overlayData?.name}</div>

        {noStoreError && (
          <div className='ov-error homec-l'>Please Select a Store</div>
        )}

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

        {badQtyError && (
          <div className='ov-error homec-l'>Invalid Quantity</div>
        )}

        {leadingZero && (
          <div className='ov-error homec-l'>
            Leading 0 will be removed on submit ({quantity} turns into{" "}
            {parseInt(quantity)})
          </div>
        )}

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
            onChange={(e) => {
              if (
                String(e.target.value).length > 1 &&
                String(e.target.value)[0] === "0"
              ) {
                setLeadingZero(true);
              } else {
                setLeadingZero(false);
              }

              setQuantity(e.target.value);
            }}
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
