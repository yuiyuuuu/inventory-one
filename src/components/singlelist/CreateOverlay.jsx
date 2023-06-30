import React, { useEffect } from "react";

import $ from "jquery";

import XIcon from "../global/XIcon";

const CreateOverlay = ({
  setShowCreateOverlay,
  handleImageUpload,
  setProductInfo,
  productInfo,
  imagePreview,
  handleSubmit,
  setImagePreview,
  createLoading,
}) => {
  useEffect(() => {
    $("#create-name").focus(() => {
      $("#create-name")
        .parent()
        .css("border-bottom", "1px solid rgba(0, 255,255)");
    });

    $("#create-name").focusout(() => {
      $("#create-name").parent().css("border-bottom", "1px solid red");
    });

    $("#create-qty").focus(() => {
      $("#create-qty")
        .parent()
        .css("border-bottom", "1px solid rgba(0, 255,255)");
    });

    $("#create-qty").focusout(() => {
      $("#create-qty").parent().css("border-bottom", "1px solid red");
    });

    $("#create-units").focus(() => {
      $("#create-units")
        .parent()
        .css("border-bottom", "1px solid rgba(0, 255,255)");
    });

    $("#create-units").focusout(() => {
      $("#create-units").parent().css("border-bottom", "1px solid red");
    });
  }, []);

  return (
    <div className="home-createoverlay">
      <div className="homec-inner">
        <div className="homec-l">Add a Product</div>

        <div className="homec-inputcontainer">
          <input
            placeholder="Name"
            className="homec-input"
            id="create-name"
            value={productInfo.name}
            onChange={(e) =>
              setProductInfo((prev) => {
                return { ...prev, name: e.target.value };
              })
            }
          />
        </div>

        <div className="homec-inputcontainer">
          <input
            placeholder="Quantity"
            className="homec-input"
            id="create-qty"
            value={productInfo.quantity}
            type="number"
            onChange={(e) =>
              setProductInfo((prev) => {
                return { ...prev, quantity: e.target.value };
              })
            }
          />
        </div>

        <div className="homec-inputcontainer">
          <input
            placeholder="Units"
            className="homec-input"
            id="create-units"
            value={productInfo.units}
            onChange={(e) =>
              setProductInfo((prev) => {
                return { ...prev, units: e.target.value };
              })
            }
          />
        </div>
        {!productInfo?.image && (
          <button className="homec-upload" onClick={() => handleImageUpload()}>
            Upload Image
          </button>
        )}

        {productInfo.image && (
          <div className="flexcol-aligncenter">
            <img src={imagePreview} className="homec-imgpre" />
            <button
              className="homec-but homec-remove"
              onClick={() => {
                setProductInfo((prev) => {
                  return { ...prev, image: null };
                });

                setImagePreview(null);
              }}
            >
              Remove Image
            </button>
          </div>
        )}

        <button
          className="homec-submit homec-but"
          onClick={() => handleSubmit()}
        >
          Submit
        </button>

        <XIcon
          top={"21px"}
          right={"30px"}
          func={function () {
            setShowCreateOverlay(false);
            document.querySelector("html").style.overflow = "";
          }}
        />
      </div>

      <div
        className="homec-clickback"
        onClick={() => {
          setShowCreateOverlay(false);
          setProductInfo({ name: "", qty: 0, image: null });
          document.querySelector("html").style.overflow = "";
        }}
      />

      {createLoading && (
        <div className="submit-loading">
          <div className="lds-ring" id="spinner-form">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateOverlay;