import React, { useState, useEffect } from "react";

import $ from "jquery";

const AddOverlay = ({ setShowAddOverlay, setOverlayData, overlayData }) => {
  const [quantity, setQuantity] = useState(1);

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
      className='ov-parent'
      onClick={() => {
        setShowAddOverlay(false);
        setOverlayData({});
      }}
    >
      <div
        className='homec-inner ov-media'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='homec-l'>Add Quantity</div>

        <div className='ov-divider' />

        <div className='homec-l'>{overlayData?.name}</div>

        <div className='homec-inputcontainer'>
          <input
            placeholder='Quantity'
            className='homec-input'
            value={quantity}
            type='number'
            id='ov-add'
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>

        <div className='homec-submit homec-but ov-submit'>Submit</div>
      </div>
    </div>
  );
};

export default AddOverlay;
