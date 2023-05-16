import React from "react";
import XIcon from "../global/XIcon";

const CreateOverlay = ({
  setShowCreateOverlay,
  handleImageUpload,
  setProductInfo,
  productInfo,
  imagePreview,
  handleSubmit,
  setImagePreview,
}) => {
  return (
    <div className='home-createoverlay'>
      <div className='homec-inner'>
        <div className='homec-l'>Add a Product</div>

        <div className='homec-inputcontainer'>
          <input
            placeholder='Name'
            className='homec-input'
            value={productInfo.name}
            onChange={(e) =>
              setProductInfo((prev) => {
                return { ...prev, name: e.target.value };
              })
            }
          />
        </div>

        <div className='homec-inputcontainer'>
          <input
            placeholder='Quantity'
            className='homec-input'
            value={productInfo.quantity}
            type='number'
            onChange={(e) =>
              setProductInfo((prev) => {
                return { ...prev, quantity: e.target.value };
              })
            }
          />
        </div>

        <div className='homec-inputcontainer'>
          <input
            placeholder='Units'
            className='homec-input'
            value={productInfo.units}
            onChange={(e) =>
              setProductInfo((prev) => {
                return { ...prev, units: e.target.value };
              })
            }
          />
        </div>
        {!productInfo?.image && (
          <button className='homec-upload' onClick={() => handleImageUpload()}>
            Upload Image
          </button>
        )}

        {productInfo.image && (
          <div className='flexcol-aligncenter'>
            <img src={imagePreview} className='homec-imgpre' />
            <button
              className='homec-but homec-remove'
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
          className='homec-submit homec-but'
          onClick={() => handleSubmit()}
        >
          Submit
        </button>

        <XIcon
          top={"21px"}
          right={"30px"}
          func={function () {
            setShowCreateOverlay(false);
          }}
        />
      </div>

      <div
        className='homec-clickback'
        onClick={() => {
          setShowCreateOverlay(false);
          setProductInfo({ name: "", qty: 0, image: null });
        }}
      />
    </div>
  );
};

export default CreateOverlay;
