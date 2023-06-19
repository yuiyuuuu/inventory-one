import React, { useState, useEffect } from "react";

import $ from "jquery";

const AddOverlay = ({
  setShowAddOverlay,
  setOverlayData,
  overlayData,
  allStores,
}) => {
  const [quantity, setQuantity] = useState(1);

  const [showSelectStores, setShowSelectStores] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);

  useEffect(() => {
    $(".aover-selch").css("top", $("aover-select").outerHeight() + 14);
  }, [$("aover-select").outerHeight()]);

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

        <div className="pio-rel">
          <div
            className="pio-select  aover-select"
            onClick={() => setShowSelectStores((prev) => !prev)}
            style={{ padding: "5px" }}
          >
            {selectedStore ? selectedStore.name : "Select a store"}
            <div className="grow" />
            <div
              className="mitem-caret"
              style={{ transform: !showSelectStores && "rotate(-90deg)" }}
            />
          </div>

          {showSelectStores && (
            <div className="pio-selch aover-selch">
              {allStores?.map((v) => (
                <div
                  className="pio-ch"
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

        <div className="homec-submit homec-but">Submit</div>
      </div>
    </div>
  );
};

export default AddOverlay;
