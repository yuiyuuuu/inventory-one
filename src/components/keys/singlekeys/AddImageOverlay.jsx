import React, { useState } from "react";

import { Buffer } from "buffer";

import TrashCanSvg from "../../print/svg/TrashCanSvg";
import { makePostRequestWithAuth } from "../../../requests/helperFunctions";

const AddImageOverlay = ({
  setShowAddImage,
  selectedStore,
  setSelectedStore,
}) => {
  const [images, setImages] = useState([]);

  function onSelectFile(e) {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    const objecturl = URL.createObjectURL(e.target.files[0]);

    async function getBase64Image(img) {
      const arrayBuffer = await (await fetch(img)).arrayBuffer();
      const buffer = Buffer.from(arrayBuffer).toString("base64");

      const re = {
        image: buffer,
        preview: objecturl,
      };

      setImages((prev) => [...prev, re]);
    }

    getBase64Image(objecturl);
  }

  function handleUploadImage() {
    const input = document.createElement("input");
    input.hidden = true;
    input.accept = "image/png, image/jpeg";
    input.type = "file";
    input.onchange = onSelectFile;

    input.click();
  }

  async function handleSubmit() {
    if (!images?.length) return;

    await makePostRequestWithAuth(
      "keys/addimage",
      { images: images, storeId: selectedStore.id },
      import.meta.env.VITE_ROUTEPASS
    )
      .then((res) => {
        console.log(res);
        if (res?.id) {
          setSelectedStore(res);
          alert("Images added");
          setShowAddImage(false);
        }
      })
      .catch(() => {
        alert("Something went wrong, please try again");
      });
  }

  return (
    <div className='home-createoverlay' onClick={() => setShowAddImage(false)}>
      <div className='homec-inner' onClick={(e) => e.stopPropagation()}>
        <div className='homec-l'>Add Key Image</div>

        <button className='homec-upload' onClick={() => handleUploadImage()}>
          Upload Image
        </button>

        {images?.length > 0 && (
          <ol className='kh-ol'>
            {images?.map((im, i) => (
              <div className='kh-licon'>
                <div
                  onClick={() => {
                    setImages((prev) => [...prev.toSpliced(i, 1)]);
                  }}
                  className='kh-trashcon'
                >
                  <TrashCanSvg />
                </div>
                <li className='kh-previewli'>
                  <img src={im?.preview} className='kh-preview' />
                </li>
              </div>
            ))}
          </ol>
        )}

        {images?.length > 0 && (
          <button
            className='homec-submit homec-but'
            onClick={() => handleSubmit()}
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
};

export default AddImageOverlay;
