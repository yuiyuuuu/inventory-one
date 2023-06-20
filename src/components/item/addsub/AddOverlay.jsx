import React, { useState, useEffect } from "react";

import $ from "jquery";
import { makePutRequest } from "../../requests/requestFunctions";

const AddOverlay = ({
  setShowAddOverlay,
  setOverlayData,
  overlayData,
  setAllProducts,
}) => {
  const [quantity, setQuantity] = useState(1);

  const [leadingZero, setLeadingZero] = useState(false);
  const [badQtyError, setBadQtyError] = useState(false);

  async function handleSubmit() {
    if (parseInt(quantity) < 1) {
      setBadQtyError(true);
      return;
    }

    const obj = {
      which: "add",
      quantity: parseInt(quantity),
      id: overlayData.id,
    };

    await makePutRequest("item/editqty", obj)
      .then((res) => {
        setAllProducts((prev) =>
          prev.map((item) => (item.id === res.id ? res : item))
        );

        setShowAddOverlay(false);
        alert("Product Quantity Added");
      })
      .catch(() => {
        alert("Something went wrong, please try again");
      });
  }

  useEffect(() => {
    $("#ov-add")
      .focus()
      .parent()
      .css("border-bottom", "1px solid rgba(0,255,255)");

    $("#ov-add").focus(() => {
      $("#ov-add").parent().css("border-bottom", "1px solid rgba(0, 255,255)");
    });

    $("#ov-add").focusout(() => {
      $("#ov-add").parent().css("border-bottom", "1px solid red");
    });
  }, []);

  return (
    <div
      className="ov-parent"
      onClick={() => {
        setShowAddOverlay(false);
        setOverlayData({});
      }}
    >
      <div
        className="homec-inner ov-inner "
        onClick={(e) => e.stopPropagation()}
      >
        <div className="homec-l">Add Quantity</div>

        <div className="ov-divider" />

        <div className="homec-l">{overlayData?.name}</div>

        {badQtyError && (
          <div className="ov-error homec-l">Invalid Quantity</div>
        )}

        {leadingZero && (
          <div className="ov-error homec-l">
            Leading 0 will be removed on submit ({quantity} turns into{" "}
            {parseInt(quantity)})
          </div>
        )}

        <div className="homec-inputcontainer">
          <input
            placeholder="Quantity"
            className="homec-input"
            value={quantity}
            type="number"
            id="ov-add"
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
          className="homec-submit homec-but ov-submit"
          onClick={() => handleSubmit()}
        >
          Submit
        </div>
      </div>
    </div>
  );
};

export default AddOverlay;
