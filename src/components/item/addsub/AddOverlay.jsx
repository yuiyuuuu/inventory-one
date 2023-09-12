import React, { useState, useEffect } from "react";

import $ from "jquery";
import {
  isValidHttpUrl,
  makePutRequest,
  makePutRequestWithAuth,
} from "../../../requests/helperFunctions";

const AddOverlay = ({
  setShowAddOverlay,
  setOverlayData,
  overlayData,
  setAllProducts,
}) => {
  const [quantity, setQuantity] = useState(1);

  const [leadingZero, setLeadingZero] = useState(false);
  const [badQtyError, setBadQtyError] = useState(false);

  const [isShipment, setIsShipment] = useState(false);

  //dont add qty means they only want to add shipment, dont add the qty
  //used for adding past orders to correctly reflect data, not present shipments orders
  const [dontAddQty, setDontAddQty] = useState(false);

  //shipment inputs
  const [shipmentStore, setShipmentStore] = useState("");
  const [shipmentDate, setShipmentDate] = useState(null);
  const [shipmentLink, setShipmentLink] = useState(null); //optional

  const [shipmentStoreError, setShipmentStoreError] = useState(false);
  const [shipmentDateError, setShipmentDateError] = useState(false);
  const [shipmentLinkError, setShipmentLinkError] = useState(false);

  async function handleSubmit() {
    let bad = false;

    //set error states to false
    setBadQtyError(false);
    setShipmentDateError(false);
    setShipmentStoreError(false);
    setShipmentLinkError(false);

    if (parseInt(quantity) < 1) {
      setBadQtyError(true);
      bad = true;
    }

    if (isShipment) {
      if (typeof shipmentDate !== "string") {
        setShipmentDateError(true);
        bad = true;
      }

      if (!shipmentStore) {
        setShipmentStoreError(true);
        bad = true;
      }

      if (shipmentLink && !isValidHttpUrl(shipmentLink)) {
        setShipmentLinkError(true);
        bad = true;
      }
    }

    if (bad) return;

    const obj = {
      which: "add",
      quantity: parseInt(quantity),
      id: overlayData.id,
      isShipment,
      shipmentDate,
      shipmentStore,
      shipmentLink,
      dontAddQty,
    };

    await makePutRequestWithAuth(
      `item/editqty`,
      obj,
      import.meta.env.VITE_ROUTEPASS
    )
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

        <div className="item-shipincon">
          <input
            type="checkbox"
            id="shipment"
            checked={isShipment}
            onClick={() => setIsShipment((prev) => !prev)}
          />
          <label
            htmlFor="shipment"
            className="item-shiplabel"
            style={{ marginTop: "3px" }}
          >
            Shipment
          </label>
        </div>

        {isShipment && (
          <div className="item-shipcon">
            <div
              className="homec-inputcontainer"
              style={{ position: "relative" }}
            >
              {shipmentDateError && (
                <div className="home-error">Shipment Date is required</div>
              )}
              <input
                className="homec-input"
                value={shipmentDate}
                type="date"
                id="shipment-date"
                onChange={(e) => setShipmentDate(e.target.value)}
              />
            </div>

            <div className="homec-inputcontainer">
              {shipmentStoreError && (
                <div className="home-error">Shipment Store is required</div>
              )}
              <input
                placeholder="Store"
                className="homec-input"
                value={shipmentStore}
                onChange={(e) => setShipmentStore(e.target.value)}
              />
            </div>

            <div className="homec-inputcontainer">
              {shipmentLinkError && (
                <div className="home-error">Invalid Link</div>
              )}
              <input
                placeholder="Order Link (optional)"
                className="homec-input"
                value={shipmentLink}
                onChange={(e) => setShipmentLink(e.target.value)}
              />
            </div>

            <div className="item-shipincon">
              <input
                type="checkbox"
                id="dontadd"
                checked={dontAddQty}
                onClick={() => setDontAddQty((prev) => !prev)}
              />
              <label
                htmlFor="dontadd"
                className="item-shiplabel"
                style={{ marginTop: "3px" }}
              >
                Don't Add Quantity
              </label>
            </div>
          </div>
        )}

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
