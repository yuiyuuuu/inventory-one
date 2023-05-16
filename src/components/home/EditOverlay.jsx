import React, { useState } from "react";

import { Buffer } from "buffer";
import {
  makeDeleteRequest,
  makePutRequest,
} from "../requests/requestFunctions";
import XIcon from "../global/XIcon";

const EditOverlay = ({
  selectedProduct,
  setShowEditOverlay,
  setSelectedProduct,
  handleSubmitEdit,
  setAllProducts,
  setQueryResults,
  allProducts,
  queryResults,
  fetchProducts,
}) => {
  const [imagePreview, setImagePreview] = useState(null);

  function handleImageUpload(e) {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/png, image/jpeg";
    input.onchange = onSelectFile;
    input.hidden = true;
    input.click();
  }

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    const objecturl = URL.createObjectURL(e.target.files[0]);
    setImagePreview(objecturl);

    async function getBase64Image(img) {
      const arrayBuffer = await (await fetch(img)).arrayBuffer();
      const buffer = Buffer.from(arrayBuffer).toString("base64");

      setSelectedProduct((prev) => {
        return { ...prev, image: buffer };
      });
    }

    getBase64Image(objecturl);
  };

  async function handleSubmitEdit() {
    const obj = {
      id: selectedProduct.id,
      name: selectedProduct.name,
      quantity: Number(selectedProduct.quantity),
      image: selectedProduct.image || null,
      units: selectedProduct?.units,
    };

    await makePutRequest("/item/edit/info", obj)
      .then((res) => {
        setSelectedProduct({});

        setAllProducts(allProducts.map((v) => (v.id === res.id ? res : v)));

        if (queryResults.length) {
          setQueryResults(queryResults.map((v) => (v.id === res.id ? res : v)));
        }

        //finish the request api route
        alert("Product Edited");
        setShowEditOverlay(false);
      })
      .catch(() => {
        alert("Something went wrong, try again");
      });
  }

  async function handleDelete() {
    await makeDeleteRequest(`/item/delete/${selectedProduct.id}`)
      .then(() => {
        setShowEditOverlay(false);
        setAllProducts((prev) =>
          prev.filter((v) => v.id !== selectedProduct.id)
        );

        if (queryResults) {
          setQueryResults(
            queryResults.filter((v) => v.id !== selectedProduct.id)
          );
        }

        setSelectedProduct({});
        alert("Product Deleted");
      })
      .catch(() => {
        alert("Something went wrong, try again");
      });
  }

  return (
    <div className='home-createoverlay'>
      <div className='homec-inner'>
        <div className='homec-l'>Edit a Product</div>

        <div className='homec-inputcontainer'>
          <input
            placeholder='Name'
            className='homec-input'
            value={selectedProduct?.name}
            onChange={(e) =>
              setSelectedProduct((prev) => {
                return { ...prev, name: e.target.value };
              })
            }
          />
        </div>

        <div className='homec-inputcontainer'>
          <input
            placeholder='Quantity'
            className='homec-input'
            value={selectedProduct.quantity}
            type='number'
            onChange={(e) =>
              setSelectedProduct((prev) => {
                return { ...prev, quantity: e.target.value };
              })
            }
          />
        </div>

        <div className='homec-inputcontainer'>
          <input
            placeholder='Units'
            className='homec-input'
            value={selectedProduct.units}
            onChange={(e) =>
              setSelectedProduct((prev) => {
                return { ...prev, units: e.target.value };
              })
            }
          />
        </div>
        {!selectedProduct?.image && (
          <button className='homec-upload' onClick={() => handleImageUpload()}>
            Upload Image
          </button>
        )}

        {selectedProduct.image && (
          <div className='flexcol-aligncenter'>
            <img
              src={
                imagePreview
                  ? imagePreview
                  : `data:image/png;base64,${selectedProduct.image}`
              }
              className='homec-imgpre'
            />
            <button
              className='homec-but homec-remove'
              onClick={() => {
                setSelectedProduct((prev) => {
                  return { ...prev, image: null };
                });
              }}
            >
              Remove Image
            </button>
          </div>
        )}

        <div className='homec-div'></div>

        <button
          className='homec-submit homec-but'
          onClick={() => handleSubmitEdit()}
        >
          Submit
        </button>

        <button className='homec-del homec-but' onClick={() => handleDelete()}>
          Delete Product
        </button>

        <XIcon
          top={"21px"}
          right={"30px"}
          func={function () {
            setShowEditOverlay(false);
          }}
        />
      </div>

      <div
        className='homec-clickback'
        onClick={() => {
          setShowEditOverlay(false);
          setSelectedProduct(null);
        }}
      />
    </div>
  );
};

export default EditOverlay;
