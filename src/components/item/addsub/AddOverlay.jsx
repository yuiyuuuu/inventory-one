import React, { useState } from "react";

const AddOverlay = ({ setShowAddOverlay, setOverlayData, overlayData }) => {
  const [quantity, setQuantity] = useState(1);

  return (
    <div
      className="ov-parent"
      onClick={() => {
        setShowAddOverlay(false);
        setOverlayData({});
      }}
    >
      <div
        className="homec-inner ov-media"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="homec-l">Add Quantity</div>

        <div className="ov-divider" />

        <div className="homec-l">{overlayData?.name}</div>

        <div className="homec-inputcontainer">
          <input
            placeholder="Quantity"
            className="homec-input"
            value={quantity}
            type="number"
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>

        <div className="homec-submit homec-but">Submit</div>
      </div>
    </div>
  );
};

export default AddOverlay;
